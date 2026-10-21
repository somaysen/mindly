"use client";

import { useState, useEffect } from "react";
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

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import Topbar from "@/components/Navber/Topbar";

export default function Notepad() {
  const editor = useCreateBlockNote();
  const [title, setTitle] = useState("Untitled note");
  const [wordCount, setWordCount] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  useEffect(() => {
    const updateCount = () => {
      const text = editor.blocksToMarkdownLossy(editor.document).trim();
      setWordCount(text ? text.split(/\s+/).filter(Boolean).length : 0);
    };
    updateCount();
  }, [editor]);

  const handleSave = async () => {
    setIsSaving(true);
    // Replace with your real save logic
    await new Promise((r) => setTimeout(r, 600));
    setLastSaved(
      new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    );
    setIsSaving(false);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b0a1a] text-white">
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_45%_at_15%_0%,rgba(99,102,241,0.16),transparent),radial-gradient(ellipse_50%_35%_at_90%_25%,rgba(139,92,246,0.10),transparent)]"
      />

      <header className="relative z-20  ">
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          <Topbar />
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-10 sm:px-5">
        {/* Compact header */}
        <div className="mb-5 flex flex-col gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-2.5 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-indigo-300/70">
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/15 text-indigo-300">
                <FileText size={11} strokeWidth={2.2} />
              </span>
              Workspace
              <span className="text-white/20">/</span>
              <span className="text-white/45">Note</span>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-label="Note title"
              placeholder="Untitled note"
              className="w-full bg-transparent text-[28px] font-semibold leading-tight tracking-tight text-white outline-none placeholder:text-white/25 focus-visible:ring-0 sm:text-[34px]"
            />
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
              <FileText size={15} strokeWidth={2} />
            </div>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.12em] text-white/35">
                Format
              </p>
              <p className="text-xs font-medium text-white/75">Rich text</p>
            </div>
          </div>
        </div>

        {/* Editor */}
        <section className="overflow-hidden rounded-2xl border border-white/[0.08] ">
          {/* Toolbar – compact */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] bg-[#15143a] px-2.5 py-2 sm:px-4">
            <div className="flex items-center gap-0.5 rounded-lg border border-white/[0.06] bg-[#0e0d26] p-0.5">
              <ToolbarButton
                label="Undo"
                onClick={() => editor.undo()}
                icon={<Undo2 size={14} strokeWidth={2.2} />}
              />
              <ToolbarButton
                label="Redo"
                onClick={() => editor.redo()}
                icon={<Redo2 size={14} strokeWidth={2.2} />}
              />

              <div className="mx-1 h-4 w-px bg-white/10" />

              <ToolbarButton
                label="Bold"
                onClick={() => editor.toggleStyles({ bold: true })}
                icon={<Bold size={14} strokeWidth={2.4} />}
              />
              <ToolbarButton
                label="Italic"
                onClick={() => editor.toggleStyles({ italic: true })}
                icon={<Italic size={14} strokeWidth={2.2} />}
              />
              <ToolbarButton
                label="Underline"
                onClick={() => editor.toggleStyles({ underline: true })}
                icon={<Underline size={14} strokeWidth={2.2} />}
              />

              <div className="mx-1 h-4 w-px bg-white/10" />

              {/* Save button */}
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={handleSave}
                disabled={isSaving}
                className="flex h-7 items-center gap-1.5 rounded-md bg-indigo-500/20 px-2.5 text-[11px] font-medium text-indigo-200 transition hover:bg-indigo-500/30 active:scale-[0.97] disabled:opacity-60"
              >
                <Save
                  size={13}
                  strokeWidth={2.2}
                  className={isSaving ? "animate-pulse" : ""}
                />
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>

            <div className="flex items-center gap-2.5 px-1">
              {lastSaved && (
                <span className="hidden text-[10px] text-white/30 sm:inline">
                  Saved {lastSaved}
                </span>
              )}
              <span className="hidden items-center gap-1 text-[10px] text-white/30 sm:flex">
                <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 font-mono text-[9px] text-indigo-200/70">
                  /
                </kbd>
                blocks
              </span>
              <span className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium tabular-nums text-indigo-200/85">
                {wordCount} words
              </span>
            </div>
          </div>

          {/* Writing surface – tighter */}
          <div
            className={`min-h-[58vh] px-3 py-5 transition-all duration-200 sm:px-5 sm:py-6 ${
              isFocused ? "ring-1 ring-inset ring-indigo-500/25" : ""
            }`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          >
            <div className="mx-auto min-h-[50vh] w-full rounded-xl border border-white/[0.05] bg-[#080810] px-4 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:px-7 sm:py-6">
              <BlockNoteView
                editor={editor}
                theme="dark"
                className="mindly-notepad-editor"
                onChange={() => {
                  const text = editor
                    .blocksToMarkdownLossy(editor.document)
                    .trim();
                  setWordCount(
                    text ? text.split(/\s+/).filter(Boolean).length : 0,
                  );
                }}
              />
            </div>
          </div>
        </section>

        <footer className="mt-3.5 flex flex-wrap items-center justify-between gap-2 px-0.5 text-[10px] text-white/25">
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-emerald-400/60" />
            Keep it simple
          </span>
          <span className="tabular-nums">{editor.document.length} blocks</span>
        </footer>
      </div>
    </main>
  );
}

function ToolbarButton({
  label,
  onClick,
  icon,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-md text-white/40 transition hover:bg-white/[0.08] hover:text-white active:scale-95"
    >
      {icon}
    </button>
  );
}
