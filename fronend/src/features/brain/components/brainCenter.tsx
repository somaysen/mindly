
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
import BrainThoughtsFocus from "./BrainThoughtsFocus";

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

        <div className="mx-auto w-full max-w-[1500px] px-4 pb-10 pt-8 sm:px-6 lg:px-10">

          {/* Page heading */}
          <section className="mb-6">

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
          <section id="brain-thought-composer" className="mb-2 scroll-mt-6">

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
          <BrainThoughtsFocus
            ideas={ideas}
            isLoading={isLoading}
            isError={isError}
            isDeleting={isDeleting}
            selectedIdeaId={selectedIdeaId}
            selectedIdea={selectedIdea}
            isSelectedIdeaLoading={isSelectedIdeaLoading}
            isSelectedIdeaError={isSelectedIdeaError}
            handleEdit={handleEdit}
            handleDeleteIdea={handleDeleteIdea}
            setSelectedIdeaId={setSelectedIdeaId}
          />

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
