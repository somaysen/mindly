"use client";

import { useMemo, useState } from "react";
import Topbar from "@/components/Navber/Topbar";
import {
  useIdeaCreate,
  useIdeaDeleteById,
  useIdeaGet,
  useIdeaGetById,
  useIdeaUpdate,
} from "@/features/brain/hooks/useBrainApi";
import { toast } from "react-toastify";
import {
  ChevronUp,
  Lightbulb,
  Mic,
  Paperclip,
  Pencil,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";

type BrainIdea = {
  id: string;
  text: string;
  description: string;
};

function getIdeaRecords(response: unknown, depth = 0): Record<string, unknown>[] {
  if (depth > 5 || !response) return [];
  if (Array.isArray(response)) {
    return response.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object",
    );
  }
  if (typeof response !== "object") return [];

  const record = response as Record<string, unknown>;
  if (record._id != null || record.id != null || record.ideaId != null) {
    return [record];
  }

  for (const key of ["data", "ideas", "items", "result"]) {
    const ideas = getIdeaRecords(record[key], depth + 1);
    if (ideas.length) return ideas;
  }
  return [];
}

function normalizeIdea(idea: Record<string, unknown>): BrainIdea | null {
  const rawId = idea._id ?? idea.id ?? idea.ideaId;
  const rawText =
    idea.ideaName ?? idea.title ?? idea.name ?? idea.thought ?? idea.idea ?? idea.content;
  if (rawId == null || typeof rawText !== "string") return null;

  return {
    id: String(rawId),
    text: rawText,
    description: typeof idea.description === "string" ? idea.description : "",
  };
}

function BrainCenter() {
  const [thought, setThought] = useState("");
  const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | undefined>();

  const { data: ideasData, isLoading, isError } = useIdeaGet();
  const { mutateAsync: createIdea, isPending: isCreating } = useIdeaCreate();
  const { mutateAsync: updateIdea, isPending: isUpdating } = useIdeaUpdate();
  const { mutateAsync: deleteIdea, isPending: isDeleting } = useIdeaDeleteById();
  const {
    data: selectedIdeaData,
    isLoading: isSelectedIdeaLoading,
    isError: isSelectedIdeaError,
  } = useIdeaGetById(selectedIdeaId);

  const ideas = useMemo(
    () =>
      getIdeaRecords(ideasData)
        .map(normalizeIdea)
        .filter((idea): idea is BrainIdea => idea !== null),
    [ideasData],
  );

  const selectedIdea = useMemo(() => {
    const detail = getIdeaRecords(selectedIdeaData)
      .map(normalizeIdea)
      .find((idea): idea is BrainIdea => idea !== null);
    return detail ?? ideas.find((idea) => idea.id === selectedIdeaId) ?? null;
  }, [ideas, selectedIdeaData, selectedIdeaId]);

  const handleSaveThought = async () => {
    const value = thought.trim();
    if (!value || isCreating || isUpdating) return;

    const formData = new FormData();
    formData.append("ideaName", value);
    formData.append("description", value);

    try {
      if (editingIdeaId) {
        await updateIdea({ ideaId: editingIdeaId, data: formData });
        toast.success("Thought updated.");
      } else {
        await createIdea(formData);
        toast.success("Thought saved.");
      }
      setThought("");
      setEditingIdeaId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save thought.");
    }
  };

  const handleDeleteIdea = async (ideaId: string) => {
    try {
      await deleteIdea(ideaId);
      if (selectedIdeaId === ideaId) setSelectedIdeaId(undefined);
      if (editingIdeaId === ideaId) {
        setEditingIdeaId(null);
        setThought("");
      }
      toast.success("Thought deleted.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete thought.");
    }
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#0c0b1d]">
      <header className="h-[82px] w-full shrink-0">
        <div className="mx-auto h-full w-full max-w-[1600px] px-3">
          <Topbar />
        </div>
      </header>

      <main className="relative top-15 min-h-0 flex-1 overflow-y-auto scrollbar-none">
        <div className="mx-auto w-full max-w-[1600px] px-3 pb-10">
          <section className="pt-6">
            <h1 className="text-3xl font-semibold text-white">Brain Dump</h1>
            <p className="mt-2 text-sm text-gray-300">
              Clear your mind. We&apos;ll organize the rest.
            </p>
            <p className="mt-1 text-xs text-[#8885e8]">
              {ideas.length} {ideas.length === 1 ? "thought" : "thoughts"} saved
            </p>
          </section>

          <section className="relative mt-8 min-h-[220px] w-full rounded-xl border border-[#34345b] bg-[#191936] p-4">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Lightbulb size={15} />
              <span>What&apos;s on your mind?</span>
            </div>

            <ChevronUp size={18} className="absolute right-4 top-4 text-gray-400" />

            <textarea
              value={thought}
              onChange={(event) => setThought(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  void handleSaveThought();
                }
              }}
              placeholder="e.g. Finish the landing page copy..."
              rows={3}
              aria-label="Thought to save"
              className="mt-2 w-full resize-y bg-transparent text-sm text-white outline-none placeholder:text-gray-500"
            />

            <div className="absolute bottom-5 left-5 flex items-center gap-5">
              <Mic size={17} className="cursor-pointer text-gray-500 hover:text-white" />
              <Paperclip size={17} className="cursor-pointer text-gray-500 hover:text-white" />
            </div>

            <button
              type="button"
              onClick={() => void handleSaveThought()}
              disabled={!thought.trim() || isCreating || isUpdating}
              className="absolute bottom-5 right-5 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#8585ed] to-[#5e5be5] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles size={15} />
              {isCreating || isUpdating
                ? "Saving..."
                : editingIdeaId
                  ? "Update thought"
                  : "Save thought"}
            </button>
          </section>

          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Saved thoughts</h2>
              {editingIdeaId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingIdeaId(null);
                    setThought("");
                  }}
                  className="text-sm text-[#aaa9d8] hover:text-white"
                >
                  Cancel edit
                </button>
              )}
            </div>

            {isLoading ? (
              <p className="rounded-xl border border-[#34345b] bg-[#191936] p-5 text-sm text-gray-400">
                Loading thoughts...
              </p>
            ) : isError ? (
              <p role="alert" className="rounded-xl border border-red-400/20 bg-[#191936] p-5 text-sm text-red-300">
                Could not load saved thoughts.
              </p>
            ) : ideas.length === 0 ? (
              <p className="rounded-xl border border-[#34345b] bg-[#191936] p-5 text-sm text-gray-400">
                Your saved thoughts will appear here.
              </p>
            ) : (
              <div className="space-y-3">
                {ideas.map((idea) => (
                  <article key={idea.id} className="rounded-xl border border-[#34345b] bg-[#191936] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <button
                        type="button"
                        onClick={() => setSelectedIdeaId(idea.id)}
                        className="min-w-0 flex-1 text-left"
                      >
                        <h3 className="truncate text-sm font-medium text-white">{idea.text}</h3>
                        {idea.description && idea.description !== idea.text && (
                          <p className="mt-1 line-clamp-2 text-xs text-gray-400">{idea.description}</p>
                        )}
                      </button>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          aria-label={`Edit ${idea.text}`}
                          onClick={() => {
                            setEditingIdeaId(idea.id);
                            setThought(idea.text);
                          }}
                          className="rounded-lg p-2 text-gray-400 hover:bg-white/10 hover:text-white"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete ${idea.text}`}
                          disabled={isDeleting}
                          onClick={() => void handleDeleteIdea(idea.id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-400/10 hover:text-red-300 disabled:opacity-50"
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

          {selectedIdeaId && (
            <section className="mt-5 rounded-xl border border-[#45456e] bg-[#242448] p-4" aria-live="polite">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-white">Thought details</h2>
                  {isSelectedIdeaLoading ? (
                    <p className="mt-2 text-sm text-gray-400">Loading...</p>
                  ) : isSelectedIdeaError ? (
                    <p className="mt-2 text-sm text-red-300">Could not load this thought.</p>
                  ) : selectedIdea ? (
                    <>
                      <p className="mt-2 text-sm text-white">{selectedIdea.text}</p>
                      {selectedIdea.description && selectedIdea.description !== selectedIdea.text && (
                        <p className="mt-1 text-xs text-gray-400">{selectedIdea.description}</p>
                      )}
                    </>
                  ) : (
                    <p className="mt-2 text-sm text-gray-400">No details available.</p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Close thought details"
                  onClick={() => setSelectedIdeaId(undefined)}
                  className="rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

export default BrainCenter;
