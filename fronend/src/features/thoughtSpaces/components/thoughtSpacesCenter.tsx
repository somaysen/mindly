"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Clock3,
  ArrowUpRight,
  LayoutGrid,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

type ThoughtSpace = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "mindly-thought-spaces-v1";

function readSpaces(): ThoughtSpace[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (space): space is ThoughtSpace =>
        Boolean(space) &&
        typeof space === "object" &&
        typeof space.id === "string" &&
        typeof space.title === "string" &&
        typeof space.createdAt === "string" &&
        typeof space.updatedAt === "string",
    );
  } catch {
    return [];
  }
}

function formatUpdated(date: string) {
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime())
    ? "Recently updated"
    : `Last opened ${parsed.toLocaleDateString()}`;
}

export default function ThoughtSpacesCenter() {
  const router = useRouter();
  const [spaces, setSpaces] = useState<ThoughtSpace[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const [editingSpaceId, setEditingSpaceId] = useState<string | null>(null);

  useEffect(() => {
    setSpaces(readSpaces());
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (isReady) localStorage.setItem(STORAGE_KEY, JSON.stringify(spaces));
  }, [isReady, spaces]);

  const visibleSpaces = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return spaces
      .filter((space) => space.title.toLocaleLowerCase().includes(query))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [search, spaces]);

  const openCreate = () => {
    setEditingSpaceId(null);
    setSpaceName("");
    setIsCreateOpen(true);
  };

  const openRename = (space: ThoughtSpace) => {
    setEditingSpaceId(space.id);
    setSpaceName(space.title);
    setIsCreateOpen(true);
  };

  const openSpace = (space: ThoughtSpace) => {
    const now = new Date().toISOString();
    const updatedSpaces = spaces.map((item) =>
      item.id === space.id ? { ...item, updatedAt: now } : item,
    );
    setSpaces(updatedSpaces);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSpaces));
    router.push(`/canvas/${encodeURIComponent(space.id)}`);
  };

  const saveSpace = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = spaceName.trim();
    if (!title) return;

    const now = new Date().toISOString();
    if (editingSpaceId) {
      setSpaces((current) =>
        current.map((space) =>
          space.id === editingSpaceId
            ? { ...space, title, updatedAt: now }
            : space,
        ),
      );
    } else {
      const space: ThoughtSpace = {
        id: crypto.randomUUID(),
        title,
        createdAt: now,
        updatedAt: now,
      };
      const updatedSpaces = [space, ...spaces];
      setSpaces(updatedSpaces);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSpaces));
      router.push(`/canvas/${encodeURIComponent(space.id)}`);
    }
    setIsCreateOpen(false);
    setSpaceName("");
    setEditingSpaceId(null);
  };

  const deleteSpace = (space: ThoughtSpace) => {
    if (!window.confirm(`Delete "${space.title}" and its canvas? This cannot be undone.`)) return;
    setSpaces((current) => current.filter((item) => item.id !== space.id));
    // Remove any canvas data from the previous editor and tldraw's IndexedDB document.
    localStorage.removeItem(`mindly-canvas-${space.id}`);
    indexedDB.deleteDatabase(`TLDRAW_DOCUMENT_v2mindly-canvas-${space.id}`);
  };

  return (
    <main className="min-h-full w-full bg-[#0d0c1f] px-4 py-5 text-white sm:px-6 sm:py-7 lg:px-10 lg:py-8">
      <section className="relative isolate overflow-hidden rounded-[26px] border border-[#39365f] bg-[linear-gradient(115deg,#1d1b3d_0%,#17162f_55%,#211d4a_100%)] px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
        <div className="pointer-events-none absolute -right-16 -top-28 -z-10 h-72 w-72 rounded-full bg-violet-500/20 blur-[90px]" />
        <div className="pointer-events-none absolute bottom-[-135px] right-[25%] -z-10 h-60 w-60 rounded-full bg-blue-500/10 blur-[80px]" />
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-300/20 bg-violet-300/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#c7c4ff]">
              <Sparkles size={12} /> Your creative workspace
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-[38px]">
              Thought Spaces
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-[#c2bfdc]">
              Give your ideas room to grow. Sketch, connect thoughts, and shape a plan on a canvas of your own.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="flex h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-[#6b63ee] px-5 text-[13px] font-semibold text-white shadow-lg shadow-violet-950/40 transition hover:-translate-y-0.5 hover:bg-[#7972ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300 sm:self-auto"
          >
            <Plus size={17} /> New space
          </button>
        </div>
      </section>

      <section className="mt-8 sm:mt-10">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-[18px] font-medium">Your spaces</h2>
            <p className="mt-1 text-xs text-[#9290ab]">
              {spaces.length} {spaces.length === 1 ? "canvas" : "canvases"}
            </p>
          </div>
          {spaces.length > 0 && (
            <label className="flex h-10 w-full items-center rounded-full border border-[#45427c] bg-[#1b1939] px-3 sm:max-w-[280px]">
              <Search size={16} className="mr-2 shrink-0 text-[#aaa7d1]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="search"
                placeholder="Search spaces..."
                aria-label="Search spaces"
                className="w-full bg-transparent text-xs text-white outline-none placeholder:text-[#aaa7c5]"
              />
            </label>
          )}
        </div>

        {!isReady ? (
          <div className="rounded-2xl border border-[#34315f] bg-[#17162f] p-8 text-center text-sm text-[#aaa7c5]">
            Loading your spaces...
          </div>
        ) : visibleSpaces.length === 0 ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#45427c] bg-[#17162f]/70 px-5 py-10 text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5757ed]/15 text-[#a4a3ff]">
              <LayoutGrid size={25} />
            </div>
            <h2 className="text-xl font-semibold">
              {spaces.length ? "No spaces match your search" : "Start with a blank canvas"}
            </h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-[#aaa7c5]">
              {spaces.length
                ? "Try another name, or clear your search."
                : "Create a space to map ideas, sketch plans, and keep your thinking in one place."}
            </p>
            {spaces.length === 0 && (
              <button
                type="button"
                onClick={openCreate}
                className="mt-5 flex h-10 items-center gap-2 rounded-full bg-[#5757ed] px-5 text-sm font-medium transition hover:bg-[#6868f5]"
              >
                <Plus size={17} /> Create your first space
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleSpaces.map((space) => (
              <article
                key={space.id}
                className="group overflow-hidden rounded-2xl border border-[#34315f] bg-[#191837] shadow-[0_10px_30px_rgba(0,0,0,0.14)] transition duration-200 hover:-translate-y-1 hover:border-[#6865e9] hover:shadow-[0_18px_42px_rgba(25,20,90,0.3)]"
              >
                <button
                  type="button"
                  onClick={() => openSpace(space)}
                  className="relative flex h-[176px] w-full flex-col items-start justify-between overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_rgba(91,91,239,0.27),_transparent_58%),linear-gradient(145deg,#24224a,#17162f)] p-5 text-left"
                >
                  <span className="pointer-events-none absolute inset-0 opacity-[0.17]" style={{ backgroundImage: "radial-gradient(#b8b4ff 0.7px, transparent 0.7px)", backgroundSize: "18px 18px" }} />
                  <span className="pointer-events-none absolute right-8 top-5 h-28 w-28 rounded-full border border-violet-200/15" />
                  <span className="pointer-events-none absolute right-[62px] top-[54px] h-14 w-14 rounded-2xl border border-violet-200/20 bg-violet-200/[0.04] rotate-12" />
                  <span className="pointer-events-none absolute right-[103px] top-[83px] h-2 w-2 rounded-full bg-violet-200/60 shadow-[0_0_18px_rgba(196,181,253,0.9)]" />
                  <span className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-[#6861e8]/90 text-white shadow-lg shadow-violet-950/40">
                    <LayoutGrid size={18} />
                  </span>
                  <span>
                    <span className="relative block max-w-[70%] truncate text-lg font-semibold text-white">{space.title}</span>
                    <span className="relative mt-1 flex items-center gap-1.5 text-xs text-[#c0bdd9]">
                      <Clock3 size={12} /> {formatUpdated(space.updatedAt)}
                    </span>
                  </span>
                </button>
                <div className="flex h-12 items-center justify-between border-t border-white/5 px-4">
                  <button
                    type="button"
                    onClick={() => openSpace(space)}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#b9b8ff] transition-colors hover:text-white"
                  >
                    <span>Open canvas</span>
                    <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:transition group-hover:opacity-100 group-focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={() => openRename(space)}
                      aria-label={`Rename ${space.title}`}
                      className="rounded-lg p-2 text-[#aaa7c5] hover:bg-white/10 hover:text-white"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSpace(space)}
                      aria-label={`Delete ${space.title}`}
                      className="rounded-lg p-2 text-[#aaa7c5] hover:bg-red-400/10 hover:text-red-300"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <SpaceDialog
        isOpen={isCreateOpen}
        title={spaceName}
        isEditing={Boolean(editingSpaceId)}
        onChange={setSpaceName}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={saveSpace}
      />
    </main>
  );
}

type SpaceDialogProps = {
  isOpen: boolean;
  title: string;
  isEditing: boolean;
  onChange: (title: string) => void;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function SpaceDialog({
  isOpen,
  title,
  isEditing,
  onChange,
  onClose,
  onSubmit,
}: SpaceDialogProps) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={onSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="space-dialog-title"
        className="w-full max-w-[420px] rounded-2xl border border-[#35325f] bg-[#15142d] p-6 text-white shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="space-dialog-title" className="text-lg font-semibold">
              {isEditing ? "Rename space" : "Create a space"}
            </h2>
            <p className="mt-1 text-xs text-[#aaa7c5]">
              Give your canvas a name you&apos;ll recognize.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1 text-[#aaa7c5] hover:bg-white/10 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <label htmlFor="space-name" className="mt-6 block text-xs font-medium text-[#d0cde5]">Space name</label>
        <input
          id="space-name"
          autoFocus
          required
          maxLength={80}
          value={title}
          onChange={(event) => onChange(event.target.value)}
          placeholder="e.g. Product ideas"
          className="mt-2 h-11 w-full rounded-xl border border-[#39365f] bg-[#0d0c1f] px-3 text-sm outline-none placeholder:text-[#777493] focus:border-[#7777ff]"
        />
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-10 rounded-full border border-[#45427c] px-4 text-xs text-[#d0cde5] hover:bg-white/5">Cancel</button>
          <button type="submit" disabled={!title.trim()} className="h-10 rounded-full bg-[#5757ed] px-5 text-xs font-medium hover:bg-[#6868f5] disabled:cursor-not-allowed disabled:opacity-50">
            {isEditing ? "Save name" : "Create space"}
          </button>
        </div>
      </form>
    </div>
  );
}
