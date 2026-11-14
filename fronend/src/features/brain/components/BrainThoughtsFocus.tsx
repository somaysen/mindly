
"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Lightbulb,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type BrainIdea = {
  id: string;
  text: string;
  description: string;
};

type BrainThoughtsFocusProps = {
  ideas: BrainIdea[];
  isLoading: boolean;
  isError: boolean;
  isDeleting: boolean;
  selectedIdeaId?: string;
  selectedIdea: BrainIdea | null;
  isSelectedIdeaLoading: boolean;
  isSelectedIdeaError: boolean;
  handleEdit: (idea: BrainIdea) => void;
  handleDeleteIdea: (ideaId: string) => Promise<void>;
  setSelectedIdeaId: (ideaId: string | undefined) => void;
};

function BrainThoughtsFocus({
  ideas,
  isLoading,
  isError,
  isDeleting,
  selectedIdeaId,
  selectedIdea,
  isSelectedIdeaLoading,
  isSelectedIdeaError,
  handleEdit,
  handleDeleteIdea,
  setSelectedIdeaId,
}: BrainThoughtsFocusProps) {
  const [showAll, setShowAll] = useState(false);

  const visibleIdeas = showAll ? ideas : ideas.slice(0, 3);
  const hasMoreIdeas = ideas.length > 3;

  return (
    <div className="w-full">
      <section>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#5559ED]/20 bg-[#5559ED]/10">
                <BookOpen
                  size={18}
                  className="text-[#8588FA]"
                />
              </div>

              <h2 className="text-lg font-semibold text-white">
                Saved thoughts
              </h2>

              <span className="rounded-full border border-[#30304D] bg-[#18172F] px-2.5 py-1 text-[10px] font-semibold text-[#A6A6BD]">
                {ideas.length}
              </span>
            </div>

            <p className="mt-2 text-xs text-[#8D8DA8]">
              All your ideas, in one place.
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-[20px] border border-[#30304D] bg-[#19182F]"
              />
            ))}
          </div>
        )}

        {/* Error State */}
        {!isLoading && isError && (
          <div
            role="alert"
            className="rounded-2xl border border-red-400/20 bg-[#19182F] p-8 text-center"
          >
            <p className="text-sm text-red-300">
              Could not load your saved thoughts.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && ideas.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#383653] bg-[#19182F] px-5 py-16 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#5559ED]/30 bg-[#5559ED]/[0.12]">
              <Lightbulb
                size={28}
                className="text-[#8588FA]"
              />
            </div>

            <h3 className="text-base font-semibold text-white">
              Your mind is a blank canvas
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#8D8DA8]">
              Start by capturing your first idea. No thought is too small to save.
            </p>

            <div className="mt-5 flex items-center gap-2 text-xs text-[#8588FA]">
              <Plus size={14} />
              Start writing above
            </div>
          </div>
        )}

        {/* Saved Thoughts List */}
        {!isLoading && !isError && ideas.length > 0 && (
          <>
            <div className="flex flex-col gap-3">
              {visibleIdeas.map((idea, index) => {
                const isSelected = selectedIdeaId === idea.id;

                return (
                  <article
                    key={idea.id}
                    className={`group relative flex items-start gap-3 rounded-[20px] border px-4 py-5 transition-all duration-300 sm:gap-5 sm:px-6 ${
                      isSelected
                        ? "border-[#6569F5]/70 bg-[#5559ED]/[0.10]"
                        : "border-[#34334F] bg-[#19182F] hover:border-[#5559ED]/50 hover:bg-[#1C1B36]"
                    }`}
                  >
                    {/* Left Icon */}
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#5559ED]/20 bg-[#5559ED]/10">
                      <Lightbulb
                        size={19}
                        className="text-[#8588FA]"
                      />
                    </div>

                    {/* Thought Content */}
                    <button
                      type="button"
                      onClick={() => setSelectedIdeaId(idea.id)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <h3 className="line-clamp-2 text-sm font-semibold leading-6 text-[#F0EFFA] transition group-hover:text-white sm:text-[15px]">
                        {idea.text}
                      </h3>

                      {idea.description &&
                      idea.description !== idea.text ? (
                        <p className="mt-1.5 line-clamp-2 text-xs leading-6 text-[#A3A2BF] sm:text-[13px]">
                          {idea.description}
                        </p>
                      ) : (
                        <p className="mt-1.5 text-xs text-[#85849F]">
                          Your saved idea
                        </p>
                      )}

                      {/* Metadata */}
                      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                        <span className="flex items-center gap-2 text-xs text-[#A3A2BF]">
                          <BookOpen size={14} />
                          Thought {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="flex items-center gap-2 text-xs text-[#A3A2BF]">
                          <Lightbulb size={14} />
                          Saved idea
                        </span>
                      </div>
                    </button>

                    {/* Right Actions */}
                    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                      <button
                        type="button"
                        aria-label={`Edit ${idea.text}`}
                        onClick={() => handleEdit(idea)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#383653] text-[#9291AE] transition hover:border-[#8588FA]/40 hover:bg-[#5559ED]/10 hover:text-[#A5A7FF] sm:h-10 sm:w-10"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        aria-label={`Delete ${idea.text}`}
                        disabled={isDeleting}
                        onClick={() => void handleDeleteIdea(idea.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-transparent text-[#9291AE] transition hover:border-red-400/20 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10"
                      >
                        <Trash2 size={16} />
                      </button>

                      <button
                        type="button"
                        aria-label={`View ${idea.text}`}
                        onClick={() => setSelectedIdeaId(idea.id)}
                        className="hidden h-10 w-10 items-center justify-center rounded-full text-[#8588FA] transition hover:bg-[#5559ED]/10 sm:flex"
                      >
                        <ArrowUpRight size={18} />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Show More / Less */}
            {hasMoreIdeas && (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAll((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-xl border border-[#383653] bg-[#19182F] px-5 py-3 text-xs font-semibold text-[#B4B4CD] transition-all hover:border-[#6569F5]/50 hover:bg-[#5559ED]/10 hover:text-white"
                >
                  {showAll ? (
                    <>
                      Show less
                      <ChevronUp size={15} />
                    </>
                  ) : (
                    <>
                      Show more
                      <span className="rounded-full bg-[#5559ED]/15 px-2 py-0.5 text-[#8588FA]">
                        +{ideas.length - 3}
                      </span>
                      <ChevronDown size={15} />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Selected Thought Details */}
      {selectedIdeaId && (
        <section
          aria-live="polite"
          className="mt-7 overflow-hidden rounded-2xl border border-[#383653] bg-[#19182F]"
        >
          {/* Details Header */}
          <div className="flex items-center justify-between border-b border-[#30304D] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#5559ED]/15">
                <BookOpen
                  size={17}
                  className="text-[#8588FA]"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">
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

          {/* Details Content */}
          <div className="p-6">
            {isSelectedIdeaLoading ? (
              <div className="flex items-center gap-2 text-sm text-[#A6A6BD]">
                <Loader2
                  size={16}
                  className="animate-spin"
                />
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
    </div>
  );
}

export default BrainThoughtsFocus;
