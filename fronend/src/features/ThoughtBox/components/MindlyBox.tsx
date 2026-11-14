"use client";

import { useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import { ChevronUp, Lightbulb, Mic, Paperclip } from "lucide-react";
import {
  useClassifyTaskIdea,
  useCreateTaskIdeaPlan,
} from "@/features/ThoughtBox/hooks/useThoughtapi";

type MindlyBoxProps = {
  thought?: string;
  setThought?: Dispatch<SetStateAction<string>>;
  isThoughtExpanded?: boolean;
  setIsThoughtExpanded?: Dispatch<SetStateAction<boolean>>;
};

function MindlyBox({
  thought,
  setThought,
  isThoughtExpanded: controlledExpanded,
  setIsThoughtExpanded,
}: MindlyBoxProps) {
  const [localThought, setLocalThought] = useState(thought ?? "");
  const [localExpanded, setLocalExpanded] = useState(
    controlledExpanded ?? true,
  );
  const classifyTaskIdea = useClassifyTaskIdea();
  const createTaskIdeaPlan = useCreateTaskIdeaPlan();
  const [hasAiError, setHasAiError] = useState(false);
  const isThoughtControlled = thought !== undefined && setThought !== undefined;
  const currentThought = isThoughtControlled ? thought : localThought;
  const updateThought = isThoughtControlled ? setThought : setLocalThought;
  const isExpandedControlled =
    controlledExpanded !== undefined && setIsThoughtExpanded !== undefined;
  const isThoughtExpanded = isExpandedControlled
    ? controlledExpanded
    : localExpanded;

  const isAnalyzing =
    classifyTaskIdea.isPending || createTaskIdeaPlan.isPending;
  const canSubmit = !!currentThought.trim() && !isAnalyzing;

  const submitHandler = async () => {
    const value = currentThought.trim();

    if (!value || isAnalyzing) return;

    setHasAiError(false);

    const wordCount = value.split(/\s+/).filter(Boolean).length;

    try {
      if (wordCount > 30) {
        // More than 30 words: Generate a complete task plan
        await createTaskIdeaPlan.mutateAsync({ text: value });
      } else {
        // 30 words or fewer: Classify the task idea
        await classifyTaskIdea.mutateAsync({ text: value });
      }
      updateThought("");
    } catch (error) {
      setHasAiError(true);
    }
  };

  return (
    <div>
      <div className="rounded-[18px] border border-[#383653] bg-[#191832] p-4 shadow-[0_18px_45px_rgba(5,4,25,0.18)] sm:p-5">
        <div className="flex items-center gap-3">
          <Lightbulb size={21} strokeWidth={1.8} className="text-white/80" />
          <span className="font-[family-name:var(--font-bricolage-grotesque)] text-base font-medium sm:text-lg">
            What&apos;s on your mind?
          </span>
          <button
            type="button"
            onClick={() => {
              if (isExpandedControlled) {
                setIsThoughtExpanded((expanded) => !expanded);
              } else {
                setLocalExpanded((expanded) => !expanded);
              }
            }}
            aria-label={
              isThoughtExpanded
                ? "Collapse thought editor"
                : "Expand thought editor"
            }
            aria-expanded={isThoughtExpanded}
            className="ml-auto rounded-full p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <ChevronUp
              size={20}
              className={`transition-transform ${isThoughtExpanded ? "" : "rotate-180"}`}
            />
          </button>
        </div>

        {isThoughtExpanded && (
          <textarea
            value={currentThought}
            onChange={(e) => {
              updateThought(e.target.value);
              setHasAiError(false);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (canSubmit) void submitHandler();
              }
            }}
            placeholder="e.g. Finish the landing page copy..."
            rows={Math.min(
              5,
              Math.max(1, currentThought.split("\n").length || 1),
            )}
            aria-label="Thought to organize"
            className="mt-1 w-full resize-none bg-transparent text-sm italic text-white/70 placeholder:text-white/30 focus:outline-none"
          />
        )}

        {isThoughtExpanded && (
          <div className="mt-16 flex justify-end gap-2">
            <button
              type="button"
              aria-label="Record a thought"
              className="grid h-8 w-8 place-items-center rounded-full bg-[#30304D] text-white/80 transition hover:bg-[#45436d]"
            >
              <Mic size={15} />
            </button>

            <button
              type="button"
              aria-label="Attach a file"
              className="grid h-8 w-8 place-items-center rounded-full bg-[#30304D] text-white/80 transition hover:bg-[#45436d]"
            >
              <Paperclip size={15} />
            </button>

            <button
              type="button"
              onClick={() => void submitHandler()}
              disabled={!canSubmit}
              className="flex h-8 items-center gap-2 rounded-full bg-[#5559ED] px-4 text-xs font-medium transition hover:bg-[#6569F5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Lightbulb size={14} />
              {isAnalyzing ? "Organizing..." : "Organize"}
            </button>
          </div>
        )}
        {hasAiError && (
          <p className="mt-3 text-xs text-red-300" role="status">
            AI organization could not finish.
          </p>
        )}
      </div>
    </div>
  );
}

export default MindlyBox;
