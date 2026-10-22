
"use client";

import { useRef, useState } from "react";
import { Plus, X, FileText, Upload } from "lucide-react";

type FileModalProps = {
  open: boolean;
  error: string;
  onClose: () => void;
  onCreate: (name: string, extension: string) => void;
  onUpload: (files: FileList | null) => Promise<void>;
};

export default function FileModal({
  open,
  error,
  onClose,
  onCreate,
  onUpload,
}: FileModalProps) {
  const [mode, setMode] = useState<"create" | "upload">("create");
  const [name, setName] = useState("");
  const [extension, setExtension] = useState(".txt");
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleCreate() {
    onCreate(name, extension);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/65 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="file-modal-title"
        className="my-auto w-full max-w-md rounded-2xl border border-[#39365f] bg-[#19182f] p-5 text-white shadow-2xl sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 id="file-modal-title" className="text-lg font-semibold">
              Add to your project
            </h3>
            <p className="mt-1 text-sm text-[#aaa7c5]">
              Create a new file or upload an existing one.
            </p>
          </div>

          <button type="button" onClick={onClose} aria-label="Close popup">
            <X size={19} />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setMode("create")}
            className={`rounded-xl border p-4 text-left ${
              mode === "create"
                ? "border-[#8585ff] bg-[#302e55]"
                : "border-[#39365f] hover:bg-[#252343]"
            }`}
          >
            <FileText size={22} className="text-[#aaa7ff]" />
            <p className="mt-3 text-sm font-medium">Create File</p>
            <p className="mt-1 text-xs text-[#aaa7c5]">Start from scratch</p>
          </button>

          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`rounded-xl border p-4 text-left ${
              mode === "upload"
                ? "border-[#8585ff] bg-[#302e55]"
                : "border-[#39365f] hover:bg-[#252343]"
            }`}
          >
            <Upload size={22} className="text-[#8de0c0]" />
            <p className="mt-3 text-sm font-medium">Upload File</p>
            <p className="mt-1 text-xs text-[#aaa7c5]">From your device</p>
          </button>
        </div>

        {mode === "create" ? (
          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="project-file-name"
                className="mb-2 block text-sm text-[#d9d7ee]"
              >
                File name
              </label>

              <div className="flex gap-2">
                <input
                  id="project-file-name"
                  autoFocus
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleCreate();
                  }}
                  placeholder="project-notes"
                  className="min-w-0 flex-1 rounded-xl border border-[#39365f] bg-[#222147] px-3 py-2.5 text-sm outline-none focus:border-[#8585ff]"
                />

                <select
                  aria-label="File extension"
                  value={extension}
                  onChange={(event) => setExtension(event.target.value)}
                  className="w-24 rounded-xl border border-[#39365f] bg-[#222147] px-2 text-sm outline-none"
                >
                  <option value=".txt">.txt</option>
                  <option value=".md">.md</option>
                  <option value=".html">.html</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreate}
              className="w-full rounded-xl bg-[#7775ff] px-4 py-3 text-sm font-semibold hover:bg-[#8987ff]"
            >
              <Plus size={16} className="mr-2 inline" />
              Create File
            </button>
          </div>
        ) : (
          <div className="mt-5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center rounded-xl border border-dashed border-[#514e76] px-4 py-8 text-center hover:bg-[#252343]"
            >
              <Upload size={27} className="text-[#8de0c0]" />
              <span className="mt-3 text-sm font-medium">
                Choose files from your device
              </span>
              <span className="mt-1 text-xs text-[#aaa7c5]">
                Select one or multiple files
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(event) => {
                void onUpload(event.target.files);
                event.target.value = "";
              }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 w-full rounded-xl bg-[#7775ff] px-4 py-3 text-sm font-semibold hover:bg-[#8987ff]"
            >
              Browse Files
            </button>
          </div>
        )}

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full rounded-xl px-4 py-2.5 text-sm text-[#aaa7c5] hover:bg-[#302e55] hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
