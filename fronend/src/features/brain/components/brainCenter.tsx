
"use client";

import { useMemo, useState } from "react";
import Topbar from "@/components/Navber/Topbar";
import MindlyBox from "@/features/ThoughtBox/components/MindlyBox";
import {
  useIdeaCreate,
  useIdeaDeleteById,
  useIdeaGet,
  useIdeaGetById,
  useIdeaUpdate,
} from "@/features/brain/hooks/useBrainApi";
import { toast } from "react-toastify";
import {
  Lightbulb,
  Pencil,
  Trash2,
  X,
  Sparkles,
  Brain,
  ArrowUpRight,
  Loader2,
  BookOpen,
  Plus,
} from "lucide-react";

type BrainIdea = {
  id: string;
  text: string;
  description: string;
};

function getIdeaRecords(
  response: unknown,
  depth = 0
): Record<string, unknown>[] {
  if (depth > 5 || !response) return [];

  if (Array.isArray(response)) {
    return response.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object"
    );
  }

  if (typeof response !== "object") return [];

  const record = response as Record<string, unknown>;

  if (
    record._id != null ||
    record.id != null ||
    record.ideaId != null
  ) {
    return [record];
  }

  for (const key of ["data", "ideas", "items", "result"]) {
    const ideas = getIdeaRecords(record[key], depth + 1);
    if (ideas.length) return ideas;
  }

  return [];
}

function normalizeIdea(
  idea: Record<string, unknown>
): BrainIdea | null {
  const rawId = idea._id ?? idea.id ?? idea.ideaId;

  const rawText =
    idea.ideaName ??
    idea.title ??
    idea.name ??
    idea.thought ??
    idea.idea ??
    idea.content;

  if (rawId == null || typeof rawText !== "string") return null;

  return {
    id: String(rawId),
    text: rawText,
    description:
      typeof idea.description === "string"
        ? idea.description
        : "",
  };
}

function BrainCenter() {
  const [thought, setThought] = useState("");
  const [editingIdeaId, setEditingIdeaId] =
    useState<string | null>(null);
  const [selectedIdeaId, setSelectedIdeaId] =
    useState<string | undefined>();

  const {
    data: ideasData,
    isLoading,
    isError,
  } = useIdeaGet();

  const {
    mutateAsync: createIdea,
    isPending: isCreating,
  } = useIdeaCreate();

  const {
    mutateAsync: updateIdea,
    isPending: isUpdating,
  } = useIdeaUpdate();

  const {
    mutateAsync: deleteIdea,
    isPending: isDeleting,
  } = useIdeaDeleteById();

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
    [ideasData]
  );

  const selectedIdea = useMemo(() => {
    const detail = getIdeaRecords(selectedIdeaData)
      .map(normalizeIdea)
      .find((idea): idea is BrainIdea => idea !== null);

    return (
      detail ??
      ideas.find((idea) => idea.id === selectedIdeaId) ??
      null
    );
  }, [ideas, selectedIdeaData, selectedIdeaId]);

  const handleSaveThought = async () => {
    const value = thought.trim();

    if (!value || isCreating || isUpdating) return;

    const formData = new FormData();

    formData.append("ideaName", value);
    formData.append("description", value);

    try {
      if (editingIdeaId) {
        await updateIdea({
          ideaId: editingIdeaId,
          data: formData,
        });

        toast.success("Thought updated.");
      } else {
        await createIdea(formData);
        toast.success("Thought saved.");
      }

      setThought("");
      setEditingIdeaId(null);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not save thought."
      );
    }
  };

  const handleDeleteIdea = async (ideaId: string) => {
    try {
      await deleteIdea(ideaId);

      if (selectedIdeaId === ideaId) {
        setSelectedIdeaId(undefined);
      }

      if (editingIdeaId === ideaId) {
        setEditingIdeaId(null);
        setThought("");
      }

      toast.success("Thought deleted.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not delete thought."
      );
    }
  };

  const handleEdit = (idea: BrainIdea) => {
    setEditingIdeaId(idea.id);
    setThought(idea.text);

    document.getElementById("brain-thought-composer")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#0d0c1f] text-white">

      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#5559ED]/[0.08] blur-[120px]" />
        <div className="absolute -right-40 top-80 h-96 w-96 rounded-full bg-[#8588FA]/[0.06] blur-[120px]" />
      </div>

      {/* Topbar */}
      <header className="relative z-20 h-[82px] w-full shrink-0 border-b border-[#252442]">
        <div className="mx-auto h-full w-full max-w-[1600px] px-3 sm:px-5">
          <Topbar />
        </div>
      </header>

      <main className="relative z-10 min-h-0 flex-1 overflow-y-auto scrollbar-none">

        <div className="mx-auto w-full max-w-[1500px] px-4 pb-20 pt-8 sm:px-6 lg:px-10">

          {/* Page heading */}
          <section className="mb-9">

            <div className="flex flex-wrap items-center justify-between gap-5">

              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#5559ED]/30 bg-[#5559ED]/[0.10] px-3 py-1.5">
                  <Sparkles size={13} className="text-[#8588FA]" />
                  <span className="text-[11px] font-medium tracking-wide text-[#c5c3d3]">
                    YOUR PERSONAL THINKING SPACE
                  </span>
                </div>

                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  Brain Dump
                  <span className="ml-2 text-[#8588FA]">.</span>
                </h1>

                <p className="mt-2 max-w-lg text-sm leading-6 text-[#A6A6BD]">
                  Your mind is full of ideas. Put them here,
                  clear your head, and let creativity flow.
                </p>
              </div>

              {/* Thought counter */}
              <div className="flex items-center gap-3 rounded-2xl border border-[#30304D] bg-[#191832] px-5 py-3.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5559ED]/15">
                  <Brain size={21} className="text-[#8588FA]" />
                </div>

                <div>
                  <p className="text-2xl font-semibold tabular-nums">
                    {ideas.length}
                  </p>
                  <p className="text-xs text-[#A6A6BD]">
                    Saved thoughts
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Thought composer */}
          <section id="brain-thought-composer" className="mb-10 scroll-mt-6">

            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5559ED]/15">
                <Lightbulb size={16} className="text-[#8588FA]" />
              </div>

              <h2 className="text-base font-semibold">
                {editingIdeaId ? "Edit your thought" : "Capture a thought"}
              </h2>

              {editingIdeaId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingIdeaId(null);
                    setThought("");
                  }}
                  className="ml-auto flex items-center gap-1.5 text-xs text-[#A6A6BD] transition hover:text-white"
                >
                  <X size={14} />
                  Cancel editing
                </button>
              )}
            </div>

            <div className="rounded-2xl border border-[#30304D] bg-[#191832] p-1">

              <MindlyBox
                thought={thought}
                setThought={setThought}
                isThoughtExpanded={true}
              />

            </div>

            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={() => void handleSaveThought()}
                disabled={!thought.trim() || isCreating || isUpdating}
                className="rounded-full border border-[#383653] bg-[#191832] px-4 py-2 text-xs font-medium text-[#c5c3d3] transition hover:border-[#5559ED] hover:bg-[#1D1C3B] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCreating || isUpdating
                  ? "Saving..."
                  : editingIdeaId
                    ? "Save thought"
                    : "Save to Brain"}
              </button>
            </div>
          </section>

          {/* Saved thoughts */}
          <section>

            <div className="mb-5 flex items-center justify-between">

              <div>
                <div className="flex items-center gap-2">
                  <BookOpen size={18} className="text-[#8588FA]" />
                  <h2 className="text-lg font-semibold">
                    Saved thoughts
                  </h2>
                  <span className="rounded-full border border-[#30304D] bg-[#18172F] px-2 py-0.5 text-[10px] text-[#A6A6BD]">
                    {ideas.length}
                  </span>
                </div>

                <p className="mt-1 text-xs text-[#8D8DA8]">
                  All your ideas, in one place.
                </p>
              </div>

            </div>

            {/* Loading */}
            {isLoading && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="h-36 animate-pulse rounded-2xl border border-[#252442] bg-[#191832]"
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {!isLoading && isError && (
              <div
                role="alert"
                className="rounded-2xl border border-red-400/20 bg-[#191832] p-6 text-center"
              >
                <p className="text-sm text-red-300">
                  Could not load your saved thoughts.
                </p>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !isError && ideas.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#383653] bg-[#191832] px-5 py-16 text-center">

                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#5559ED]/30 bg-[#5559ED]/[0.12]">
                  <Lightbulb
                    size={28}
                    className="text-[#8588FA]"
                  />
                </div>

                <h3 className="text-base font-semibold">
                  Your mind is a blank canvas
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-[#8D8DA8]">
                  Start by capturing your first idea.
                  No thought is too small to save.
                </p>

                <div className="mt-5 flex items-center gap-2 text-xs text-[#8588FA]">
                  <Plus size={14} />
                  Start writing above
                </div>
              </div>
            )}

            {/* Ideas grid */}
            {!isLoading && !isError && ideas.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {ideas.map((idea, index) => {
                  const isSelected = selectedIdeaId === idea.id;

                  return (
                    <article
                      key={idea.id}
                      className={`group relative flex min-h-[175px] flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
                        isSelected
                          ? "border-[#6569F5] bg-[#5559ED]/[0.12]"
                          : "border-[#30304D] bg-[#191832] hover:-translate-y-1 hover:border-[#5559ED] hover:bg-[#1D1C3B]"
                      }`}
                    >

                      {/* Top accent */}
                      <div className="absolute left-0 top-0 h-[2px] w-0 bg-gradient-to-r from-[#5559ED] to-[#8588FA] transition-all duration-300 group-hover:w-full" />

                      <div className="mb-4 flex items-center justify-between">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5559ED]/15">
                          <Lightbulb
                            size={17}
                            className="text-[#8588FA]"
                          />
                        </div>

                        <div className="flex items-center gap-1">

                          <button
                            type="button"
                            aria-label={`Edit ${idea.text}`}
                            onClick={() => handleEdit(idea)}
                            className="rounded-lg p-2 text-[#8D8DA8] transition hover:bg-[#252442] hover:text-white"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            aria-label={`Delete ${idea.text}`}
                            disabled={isDeleting}
                            onClick={() => void handleDeleteIdea(idea.id)}
                            className="rounded-lg p-2 text-[#8D8DA8] transition hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            <Trash2 size={15} />
                          </button>

                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedIdeaId(idea.id)}
                        className="flex flex-1 flex-col text-left"
                      >
                        <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-[#E4E4F0] transition group-hover:text-[#c5c3d3]">
                          {idea.text}
                        </h3>

                        {idea.description && idea.description !== idea.text ? (
                          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#A6A6BD]">
                            {idea.description}
                          </p>
                        ) : (
                          <p className="mt-2 text-xs text-[#8D8DA8]">
                            Your saved idea
                          </p>
                        )}

                        <div className="mt-auto flex w-full items-center justify-between pt-5">
                          <span className="text-[10px] font-medium uppercase tracking-wider text-[#8D8DA8]">
                            Thought {String(index + 1).padStart(2, "0")}
                          </span>

                          <ArrowUpRight
                            size={15}
                            className="text-[#8D8DA8] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#8588FA]"
                          />
                        </div>
                      </button>

                    </article>
                  );
                })}

              </div>
            )}

          </section>

          {/* Thought details */}
          {selectedIdeaId && (
            <section
              aria-live="polite"
              className="mt-7 overflow-hidden rounded-2xl border border-[#383653] bg-[#191832]"
            >

              <div className="flex items-center justify-between border-b border-[#30304D] px-5 py-4">

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5559ED]/15">
                    <BookOpen size={17} className="text-[#8588FA]" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold">
                      Thought details
                    </h3>
                    <p className="text-[11px] text-[#8D8DA8]">
                      Your captured idea
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label="Close thought details"
                  onClick={() => setSelectedIdeaId(undefined)}
                  className="rounded-lg p-2 text-[#A6A6BD] transition hover:bg-[#252442] hover:text-white"
                >
                  <X size={17} />
                </button>

              </div>

              <div className="p-6">

                {isSelectedIdeaLoading ? (
                  <div className="flex items-center gap-2 text-sm text-[#A6A6BD]">
                    <Loader2 size={16} className="animate-spin" />
                    Loading thought...
                  </div>
                ) : isSelectedIdeaError ? (
                  <p className="text-sm text-red-300">
                    Could not load this thought.
                  </p>
                ) : selectedIdea ? (
                  <>
                    <h4 className="text-lg font-semibold leading-7 text-white">
                      {selectedIdea.text}
                    </h4>

                    {selectedIdea.description &&
                      selectedIdea.description !== selectedIdea.text && (
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#A6A6BD]">
                          {selectedIdea.description}
                        </p>
                      )}

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => handleEdit(selectedIdea)}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#5559ED]/30 bg-[#5559ED]/10 px-4 py-2.5 text-xs font-medium text-[#c5c3d3] transition hover:bg-[#5559ED]/20"
                      >
                        <Pencil size={14} />
                        Edit thought
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-[#A6A6BD]">
                    No details available.
                  </p>
                )}

              </div>
            </section>
          )}

          {/* Footer */}
          <div className="mt-12 flex items-center justify-center gap-2 text-[11px] text-[#8D8DA8]">
            <Sparkles size={12} className="text-[#8588FA]" />
            A little space for your biggest ideas.
          </div>

        </div>
      </main>
    </div>
  );
}

export default BrainCenter;
