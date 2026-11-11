
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { fileToBase64DataUri } from "@/lib/fileToBase64DataUri";
import { getApiErrorMessage } from "@/lib/apiError";
import {
  Plus,
  FolderPlus,
  Download,
  ExternalLink,
  Trash2,
  File as FileIcon,
} from "lucide-react";
import FileModal from "./fileModal";
import {
  useDeleteProjectFile,
  useGetProjectFiles,
  useUploadProjectFile,
} from "@/features/ProjectDetails/hooks/useProjectDetails";

type ProjectFile = {
  id: string;
  name: string;
  size: number;
  content?: string;
  url?: string;
  mimeType?: string;
};

const ACCEPTED_FILE_EXTENSIONS = [".txt", ".md", ".pdf", ".docx"] as const;

function isSupportedFileName(fileName: string) {
  const normalizedName = fileName.toLowerCase();
  return ACCEPTED_FILE_EXTENSIONS.some((extension) =>
    normalizedName.endsWith(extension),
  );
}

function canOpenInNotepad(item: ProjectFile) {
  return (
    isSupportedFileName(item.name) &&
    (Boolean(item.url) ||
      (item.content !== undefined && /\.(?:txt|md)$/i.test(item.name)))
  );
}

function addMissingFileExtension(
  name: string,
  mimeType: unknown,
  url: unknown,
) {
  if (/\.(?:txt|md|pdf|docx)$/i.test(name)) return name;

  const mimeExtensions: Record<string, string> = {
    "text/plain": ".txt",
    "text/markdown": ".md",
    "application/pdf": ".pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  };
  const extension =
    typeof mimeType === "string" ? mimeExtensions[mimeType] : undefined;

  if (extension) return `${name}${extension}`;
  if (typeof url === "string") {
    try {
      const urlExtension = new URL(url, "https://mindly.local").pathname.match(
        /\.(txt|md|pdf|docx)$/i,
      )?.[0];
      if (urlExtension) return `${name}${urlExtension}`;
    } catch {
      // Leave unrecognized file names unchanged.
    }
  }
  return name;
}

function getProjectFiles(response: unknown, depth = 0): ProjectFile[] {
  if (depth > 5 || response == null) return [];
  if (Array.isArray(response)) {
    return response.flatMap((entry, index) => {
      if (!entry || typeof entry !== "object") return [];
      const file = entry as Record<string, unknown>;
      const id = file.id ?? file.fileId ?? file._id;
      const name = file.name ?? file.fileName ?? file.originalName ?? file.title;
      if (id == null || typeof name !== "string") return [];
      const size = Number(file.size ?? file.fileSize ?? 0);
      const content = typeof file.content === "string" ? file.content : undefined;
      const url =
        file.downloadUrl ?? file.fileUrl ?? file.cloudinaryUrl ?? file.url;
      const mimeType = file.mimeType;
      const normalizedName = addMissingFileExtension(name, mimeType, url);
      return [{
        id: String(id ?? index),
        name: normalizedName,
        size: Number.isFinite(size) ? size : 0,
        content,
        url: typeof url === "string" ? url : undefined,
        mimeType: typeof mimeType === "string" ? mimeType : undefined,
      }];
    });
  }
  if (typeof response !== "object") return [];
  const record = response as Record<string, unknown>;
  for (const key of ["data", "files", "items", "result"]) {
    const files = getProjectFiles(record[key], depth + 1);
    if (files.length) return files;
  }
  return [];
}

type FileSectionProps = {
  projectId: string;
  embedded?: boolean;
  openRequest?: number;
};

export default function FileSection({
  projectId,
  embedded = false,
  openRequest = 0,
}: FileSectionProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const filesQuery = useGetProjectFiles(projectId);
  const uploadFile = useUploadProjectFile(projectId);
  const deleteFile = useDeleteProjectFile(projectId);
  const files = getProjectFiles(filesQuery.data);

  useEffect(() => {
    if (openRequest > 0) {
      setError("");
        setOpen(true);
    }
  }, [openRequest]);

  function openModal() {
    setError("");
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    setError("");
  }

  function createFile(name: string, extension: string) {
    const safeName = name.trim().replace(/[<>:"/\\|?*]/g, "");

    if (!safeName) {
      setError("Please enter a file name.");
      return;
    }

    const fileName = `${safeName}${extension}`;

    if (files.some((item) => item.name === fileName)) {
      setError("A file with this name already exists.");
      return;
    }

    router.push(
      `/notepad?projectId=${encodeURIComponent(projectId)}&fileName=${encodeURIComponent(fileName)}`,
    );
  }

  async function uploadFiles(selectedFiles: FileList | null) {
    if (!selectedFiles?.length) return;

    const incoming = Array.from(selectedFiles);
    const unsupported = incoming.find((file) => !isSupportedFileName(file.name));

    if (unsupported) {
      setError(`${unsupported.name} is not supported. Choose a TXT, MD, PDF, or DOCX file.`);
      return;
    }

    const existingNames = new Set(files.map((item) => item.name));
    const duplicate = incoming.find((item) => existingNames.has(item.name));

    if (duplicate) {
      setError(`${duplicate.name} already exists.`);
      return;
    }

    try {
      for (const file of incoming) {
        const fileData = await fileToBase64DataUri(file);
        await uploadFile.mutateAsync({ fileData, fileName: file.name });
      }
      closeModal();
    } catch (uploadError) {
      setError(getApiErrorMessage(uploadError));
    }
  }

  function downloadFile(item: ProjectFile) {
    if (item.url) {
      const anchor = document.createElement("a");
      anchor.href = item.url;
      anchor.download = item.name;
      anchor.target = "_blank";
      anchor.rel = "noreferrer";
      anchor.click();
      return;
    }
    if (item.content !== undefined) {
      const url = URL.createObjectURL(
        new Blob([item.content], { type: "text/plain;charset=utf-8" }),
      );
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = item.name;
      anchor.click();
      URL.revokeObjectURL(url);
    }
  }

  function openFileInNotepad(item: ProjectFile) {
    if (!isSupportedFileName(item.name)) {
      toast.error("Only TXT, MD, PDF, and DOCX files can be opened.");
      return;
    }

    if (item.content !== undefined && /\.(?:txt|md)$/i.test(item.name)) {
      const contentKey = `mindly-notepad-${crypto.randomUUID()}`;
      sessionStorage.setItem(contentKey, item.content);
      router.push(
        `/notepad?projectId=${encodeURIComponent(projectId)}&fileName=${encodeURIComponent(item.name)}&contentKey=${encodeURIComponent(contentKey)}`,
      );
      return;
    }

    let url = item.url;

    if (url) {
      try {
        const parsedUrl = new URL(url, window.location.origin);
        if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
          throw new Error("This file link uses an unsupported protocol.");
        }
        url = parsedUrl.toString();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "This file link is invalid.",
        );
        return;
      }
    } else {
      toast.error("This file is not available to open in the notepad.");
      return;
    }

    router.push(
      `/notepad?projectId=${encodeURIComponent(projectId)}&fileName=${encodeURIComponent(item.name)}&fileUrl=${encodeURIComponent(url)}`,
    );
  }

  async function removeFile(id: string) {
    try {
      await deleteFile.mutateAsync(id);
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError));
    }
  }

  function formatSize(size: number) {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  }

  const fileContent = filesQuery.isLoading ? (
          <p className="py-6 text-center text-sm text-[#aaa7c5]">
            Loading files...
          </p>
        ) : filesQuery.isError ? (
          <div className="py-6 text-center text-sm text-red-300">
            <p>{getApiErrorMessage(filesQuery.error)}</p>
            <button type="button" onClick={() => void filesQuery.refetch()} className="mt-3 underline">Try again</button>
          </div>
        ) : files.length === 0 ? (
          <button
            type="button"
            onClick={openModal}
            className="flex w-full flex-col items-center rounded-xl border border-dashed border-[#514e76] px-4 py-8 text-center transition hover:bg-white/[0.03]"
          >
            <FolderPlus size={28} className="text-[#aaa7ff]" />
            <span className="mt-3 text-sm font-medium text-white">
              Add your first file
            </span>
            <span className="mt-1 text-xs text-[#aaa7c5]">
              Create a document or upload an existing file
            </span>
          </button>
        ) : (
          <div className="space-y-2">
            {files.map((item) => (
              <div
                key={item.id}
                className="flex min-w-0 items-center gap-3 rounded-xl border border-[#39365f] bg-[#1b1a38] p-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#302e55] text-[#aaa7ff]">
                  <FileIcon size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    disabled={!canOpenInNotepad(item)}
                    onClick={() => openFileInNotepad(item)}
                    title="Open file in notepad"
                    className="block max-w-full truncate text-left text-sm font-medium text-white transition hover:text-[#aaa7ff] disabled:cursor-default disabled:hover:text-white"
                  >
                    {item.name}
                  </button>
                  <p className="text-xs text-[#aaa7c5]">
                    {formatSize(item.size)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => downloadFile(item)}
                  aria-label={`Download ${item.name}`}
                  className="rounded-lg p-2 text-[#aaa7c5] transition hover:bg-[#353260] hover:text-white"
                >
                  <Download size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => openFileInNotepad(item)}
                  disabled={!canOpenInNotepad(item)}
                  aria-label={`Open ${item.name} in notepad`}
                  title="Open file in notepad"
                  className="rounded-lg p-2 text-[#aaa7c5] transition hover:bg-[#353260] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <ExternalLink size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => void removeFile(item.id)}
                  aria-label={`Remove ${item.name}`}
                  className="rounded-lg p-2 text-[#aaa7c5] transition hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            ))}
          </div>
        );

  return (
    <>
      {embedded ? (
        fileContent
      ) : (
        <section className="rounded-2xl border border-[#292750] bg-[#222147] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-medium text-white">Files</h2>
              <p className="mt-1 text-xs text-[#aaa7c5]">
                {files.length} {files.length === 1 ? "file" : "files"} in this project
              </p>
            </div>

            <button
              type="button"
              onClick={openModal}
              aria-label="Add file"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#46436e] text-[#aaa7ff] transition hover:bg-[#353260]"
            >
              <Plus size={20} />
            </button>
          </div>

          {fileContent}
        </section>
      )}

      <FileModal
        open={open}
        error={error}
        onClose={closeModal}
        onCreate={createFile}
        onUpload={uploadFiles}
      />
    </>
  );
}
