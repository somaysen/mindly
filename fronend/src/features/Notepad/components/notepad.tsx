"use client";

import { useState, useEffect, useCallback } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import {
  Bold,
  FileText,
  Italic,
  Redo2,
  Underline,
  Undo2,
  Save,
} from "lucide-react";
import { toast } from "react-toastify";
import { useUploadProjectFile } from "@/features/ProjectDetails/hooks/useProjectDetails";
import { fileToBase64DataUri } from "@/lib/fileToBase64DataUri";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import Topbar from "@/components/Navber/Topbar";

export default function Notepad() {
  const editor = useCreateBlockNote();

  const [title, setTitle] = useState("Untitled note");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  const [projectId, setProjectId] = useState("");
  const uploadFile = useUploadProjectFile(projectId);

  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setProjectId(params.get("projectId") || "");
    setTitle(params.get("fileName") || "Untitled note");

    const fileUrl = params.get("fileUrl");
    if (!fileUrl) return;

    let cancelled = false;

    const loadFile = async () => {
      try {
        const url = new URL(fileUrl);
        if (url.protocol !== "https:" || url.hostname !== "res.cloudinary.com") {
          throw new Error("This file cannot be opened from its current location.");
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Could not load this file.");

        const content = await response.text();
        if (!cancelled && content.trim()) {
          const blocks = editor.tryParseMarkdownToBlocks(content);
          editor.replaceBlocks(editor.document, blocks);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "Could not load this file.");
        }
      }
    };

    void loadFile();
    return () => {
      cancelled = true;
    };
  }, [editor]);

  const updateCountsAndStyles = useCallback(() => {
    const text = editor.blocksToMarkdownLossy(editor.document).trim();

    setWordCount(text ? text.split(/\s+/).filter(Boolean).length : 0);
    setCharCount(text.length);

    const styles = editor.getActiveStyles();

    setActiveStyles({
      bold: !!styles.bold,
      italic: !!styles.italic,
      underline: !!styles.underline,
    });
  }, [editor]);

  useEffect(() => {
    updateCountsAndStyles();
  }, [updateCountsAndStyles]);

  const handleSave = async () => {
    const fileTitle = title.trim();

    if (!fileTitle) {
      toast.error("Please enter a file name.");
      return;
    }

    if (!projectId) {
      toast.error("Open this notepad from a project to save the file.");
      return;
    }

    const safeTitle = fileTitle.replace(/[\\/:*?"<>|]/g, "-");
    const fileName = /\.(?:txt|md|html)$/i.test(safeTitle)
      ? safeTitle
      : `${safeTitle}.txt`;

    const content = editor.blocksToMarkdownLossy(editor.document);

    const file = new File([content], fileName, {
      type: "text/plain;charset=utf-8",
    });

    setIsSaving(true);

    try {
      const fileData = await fileToBase64DataUri(file);
      await uploadFile.mutateAsync({ fileData, fileName });

      setLastSaved(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

      toast.success("File saved to your workspace!");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not save the file.";

      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white selection:bg-white/20 selection:text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_15%_0%,rgba(255,255,255,0.06),transparent),radial-gradient(ellipse_50%_35%_at_90%_25%,rgba(255,255,255,0.04),transparent)]"
      />

      <header className="relative z-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          <Topbar />
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 sm:px-5">
        <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 text-white">
                <FileText size={13} strokeWidth={2.5} />
              </span>
              Workspace
              <span className="text-white/30">/</span>
              <span className="text-white/60">Note</span>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Note title"
              placeholder="Untitled note"
              className="w-full bg-transparent text-[30px] font-bold leading-tight tracking-tight text-white outline-none placeholder:text-white/25 focus-visible:ring-0 sm:text-[38px]"
            />
          </div>

          <div className="flex shrink-0 items-center gap-3.5 rounded-2xl bg-zinc-950 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-white">
              <FileText size={18} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
                Format
              </p>
              <p className="text-sm font-semibold text-white">Rich text</p>
            </div>
          </div>
        </div>

        <section className="overflow-hidden rounded-2xl bg-black">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950 px-3 py-2.5 sm:px-5">
            <div className="flex items-center gap-1 rounded-xl bg-black p-1">
              <ToolbarButton
                label="Undo"
                onClick={() => editor.undo()}
                icon={<Undo2 size={16} strokeWidth={2.5} />}
              />

              <ToolbarButton
                label="Redo"
                onClick={() => editor.redo()}
                icon={<Redo2 size={16} strokeWidth={2.5} />}
              />

              <div className="mx-1.5 h-5 w-0.5 rounded-full bg-white/20" />

              <ToolbarButton
                label="Bold"
                isActive={activeStyles.bold}
                onClick={() => {
                  editor.toggleStyles({ bold: true });
                  updateCountsAndStyles();
                }}
                icon={<Bold size={16} strokeWidth={2.8} />}
              />

              <ToolbarButton
                label="Italic"
                isActive={activeStyles.italic}
                onClick={() => {
                  editor.toggleStyles({ italic: true });
                  updateCountsAndStyles();
                }}
                icon={<Italic size={16} strokeWidth={2.5} />}
              />

              <ToolbarButton
                label="Underline"
                isActive={activeStyles.underline}
                onClick={() => {
                  editor.toggleStyles({ underline: true });
                  updateCountsAndStyles();
                }}
                icon={<Underline size={16} strokeWidth={2.5} />}
              />

              <div className="mx-1.5 h-5 w-0.5 rounded-full bg-white/20" />

              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleSave}
                disabled={isSaving}
                className="flex h-9 items-center gap-2 rounded-xl bg-blue-600 px-4 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition hover:bg-blue-500 active:scale-95 disabled:opacity-60"
              >
                <Save
                  size={15}
                  strokeWidth={2.5}
                  className={isSaving ? "animate-pulse" : ""}
                />
                <span className="tracking-wide">
                  {isSaving ? "Saving..." : "Save"}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-3 px-1">
              {lastSaved && (
                <span className="hidden text-xs font-semibold text-white/40 sm:inline">
                  Saved {lastSaved}
                </span>
              )}

              <span className="hidden items-center gap-1.5 text-xs font-semibold text-white/40 sm:flex">
                <kbd className="rounded-md bg-white/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white/80">
                  /
                </kbd>
                blocks
              </span>

              <span className="rounded-lg bg-white/10 px-2.5 py-1 text-xs font-bold tabular-nums text-white">
                {wordCount} words
              </span>
            </div>
          </div>

          <div className="min-h-[58vh] bg-black px-3 py-5 sm:px-5 sm:py-6">
            <div className="mx-auto min-h-[50vh] w-full rounded-2xl bg-black px-4 py-5 sm:px-7 sm:py-6">
              <BlockNoteView
                editor={editor}
                theme="dark"
                className="mindly-notepad-editor"
                onChange={updateCountsAndStyles}
              />
            </div>
          </div>
        </section>

        <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-xs font-semibold text-white/30">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Keep it simple
          </span>

          <span className="tabular-nums font-bold">
            {editor.document.length} blocks
          </span>
        </footer>
      </div>
    </main>
  );
}

function ToolbarButton({
  label,
  onClick,
  icon,
  isActive = false,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  isActive?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-lg transition active:scale-95 ${
        isActive
          ? "bg-white/25 text-white"
          : "text-white/50 hover:bg-white/10 hover:text-white"
      }`}
    >
      {icon}
    </button>
  );
}
