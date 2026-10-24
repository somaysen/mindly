"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Check,
  Clock3,
  Loader2,
  Pin,
  Plus,
  Sparkles,
} from "lucide-react";

interface Task {
  _id: string;
  taskName: string;
  description?: string;
  dueDate?: string | null;
  dueTime?: string | null;
  priority?: "high" | "medium" | "low";
  status?: string;
}

interface DashbordFocusProps {
  tasks: Task[];
  isTasksLoading: boolean;
  isTasksGetError: boolean;
  handleCreateTask: () => void;
  isCreatingTask: boolean;
  isTaskCreated: boolean;
  isCreateError: boolean;
  createError: unknown;
}

const priorityClass: Record<string, string> = {
  high: "border-rose-400/20 bg-rose-400/10 text-rose-200",
  medium: "border-amber-300/20 bg-amber-300/10 text-amber-200",
  low: "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
};

function formatDate(value?: string | null) {
  if (!value) return "No due date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const today = new Date();
  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return "Today";
  }

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function DashbordFocus({
  tasks,
  isTasksLoading,
  isTasksGetError,
  handleCreateTask,
  isCreatingTask,
  isTaskCreated,
  isCreateError,
  createError,
}: DashbordFocusProps) {
  const [pinnedTasks, setPinnedTasks] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    try {
      const savedPins = localStorage.getItem("pinnedTasks");
      if (savedPins) {
        const parsedPins: unknown = JSON.parse(savedPins);
        if (Array.isArray(parsedPins)) {
          setPinnedTasks(parsedPins.filter((id): id is string => typeof id === "string"));
        }
      }
    } catch (error) {
      console.error("Failed to load pinned tasks:", error);
    }
  }, []);

  const handlePinTask = (taskId: string) => {
    setPinnedTasks((current) => {
      const updated = current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId];
      localStorage.setItem("pinnedTasks", JSON.stringify(updated));
      return updated;
    });
  };

  const toggleComplete = (taskId: string) => {
    setCompletedTasks((current) =>
      current.includes(taskId)
        ? current.filter((id) => id !== taskId)
        : [...current, taskId],
    );
  };

  const sortedTasks = [...tasks].sort((first, second) => {
    const firstPinned = pinnedTasks.includes(first._id);
    const secondPinned = pinnedTasks.includes(second._id);
    return Number(secondPinned) - Number(firstPinned);
  });
  const visibleTasks = showAll ? sortedTasks : sortedTasks.slice(0, 3);

  return (
    <section className="mx-auto mt-8 w-full max-w-3xl">
      <div className="mb-4 flex items-center justify-between gap-3 px-1">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#6669ef]/20 bg-[#6669ef]/10 text-[#a5a7ff]">
            <Sparkles size={17} />
          </span>
          <div>
            <h2 className="font-[family-name:var(--font-bricolage-grotesque)] text-lg font-semibold tracking-[-0.02em] text-[#f2f1ff] sm:text-xl">
              Today&apos;s focus
            </h2>
            <p className="mt-0.5 text-xs text-[#9291b3]">Small steps, clear momentum</p>
          </div>
          <span className="ml-1 rounded-full border border-[#6669ef]/25 bg-[#6669ef]/10 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-[#b2b3ff]">
            {tasks.length}
          </span>
        </div>

        {sortedTasks.length > 3 && !isTasksLoading && !isTasksGetError && (
          <button
            type="button"
            onClick={() => setShowAll((value) => !value)}
            className="shrink-0 rounded-full px-3 py-2 text-xs font-medium text-[#9295ff] transition hover:bg-[#6669ef]/10 hover:text-white"
          >
            {showAll ? "Show less" : "See all"}
          </button>
        )}
      </div>

      {isTasksLoading && (
        <div className="space-y-3" aria-label="Loading tasks">
          {[0, 1, 2].map((item) => (
            <div key={item} className="animate-pulse rounded-2xl border border-[#39375e] bg-[#191832]/90 p-4">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-md bg-white/10" />
                <div className="h-4 w-2/5 rounded bg-white/10" />
                <div className="ml-auto h-5 w-14 rounded-full bg-white/10" />
              </div>
              <div className="ml-8 mt-4 h-3 w-1/3 rounded bg-white/[0.06]" />
            </div>
          ))}
        </div>
      )}

      {isTasksGetError && !isTasksLoading && (
        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-400/20 bg-[#21182e] p-4 text-rose-200">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-300" />
          <div>
            <p className="text-sm font-medium">Your tasks didn&apos;t load</p>
            <p className="mt-1 text-xs text-rose-100/60">Try again in a moment.</p>
          </div>
        </div>
      )}

      {!isTasksLoading && !isTasksGetError && sortedTasks.length > 0 && (
        <div className="space-y-2.5">
          {visibleTasks.map((task) => {
            const isPinned = pinnedTasks.includes(task._id);
            const isCompleted = completedTasks.includes(task._id);
            const taskPriorityClass = task.priority
              ? priorityClass[task.priority]
              : "border-[#77759d]/20 bg-white/[0.04] text-[#aaa8c7]";

            return (
              <article
                key={task._id}
                className={`group relative overflow-hidden rounded-2xl border bg-[#191832]/90 p-4 transition duration-200 hover:-translate-y-px hover:bg-[#1d1b3d] sm:p-5 ${
                  isPinned
                    ? "border-[#7779f2]/35 shadow-[0_8px_28px_rgba(65,62,155,0.12)]"
                    : "border-[#383653] hover:border-[#5b5884]"
                }`}
              >
                {isPinned && <span aria-hidden="true" className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-[#8b8df8] to-[#6669ef]" />}

                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleComplete(task._id)}
                    aria-label={isCompleted ? `Mark ${task.taskName} incomplete` : `Complete ${task.taskName}`}
                    aria-pressed={isCompleted}
                    className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${
                      isCompleted
                        ? "border-[#7779f2] bg-[#6669ef] text-white"
                        : "border-[#5a587e] text-transparent hover:border-[#9294ff] hover:bg-[#6669ef]/10"
                    }`}
                  >
                    <Check size={13} strokeWidth={2.5} />
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`min-w-0 flex-1 truncate text-sm font-medium ${isCompleted ? "text-[#8886a7] line-through" : "text-[#f1f0ff]"}`}>
                        {task.taskName || "Untitled task"}
                      </h3>
                      {task.priority && (
                        <span className={`rounded-full border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] ${taskPriorityClass}`}>
                          {task.priority}
                        </span>
                      )}
                    </div>

                    {task.description && (
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#a3a1bd]">{task.description}</p>
                    )}

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#9291b3]">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#8587ef]" />
                        {formatDate(task.dueDate)}
                      </span>
                      {task.dueTime && (
                        <span className="inline-flex items-center gap-1.5">
                          <Clock3 size={13} className="text-[#8587ef]" />
                          {task.dueTime}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePinTask(task._id)}
                    aria-label={isPinned ? `Unpin ${task.taskName}` : `Pin ${task.taskName}`}
                    aria-pressed={isPinned}
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${
                      isPinned
                        ? "bg-[#6669ef]/15 text-[#aaaaff]"
                        : "text-[#716f91] opacity-70 hover:bg-white/[0.06] hover:text-[#c4c3e2] sm:opacity-0 sm:group-hover:opacity-100"
                    }`}
                  >
                    <Pin size={15} className={isPinned ? "rotate-[-25deg] fill-current" : ""} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {!isTasksLoading && !isTasksGetError && tasks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#4b496f] bg-[#191832]/65 px-5 py-8 text-center sm:py-9">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl border border-[#6669ef]/20 bg-[#6669ef]/10 text-[#a5a7ff]">
            <Sparkles size={20} />
          </span>
          <h3 className="mt-3 text-sm font-semibold text-[#f1f0ff]">A clear space to begin</h3>
          <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-[#9291b3]">Add one small task and build momentum from there.</p>
          <button
            type="button"
            onClick={handleCreateTask}
            disabled={isCreatingTask}
            className="mt-4 inline-flex h-9 items-center gap-2 rounded-full bg-[#6265ed] px-4 text-xs font-semibold text-white shadow-[0_8px_22px_rgba(98,101,237,0.2)] transition hover:bg-[#7375f4] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCreatingTask ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            {isCreatingTask ? "Creating task..." : "Create a task"}
          </button>
        </div>
      )}

      {isTaskCreated && !isCreateError && (
        <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-300">
          <Check size={14} /> Task created successfully.
        </p>
      )}
      {isCreateError && (
        <p role="alert" className="mt-3 flex items-center gap-1.5 text-xs font-medium text-rose-300">
          <AlertCircle size={14} />
          {createError instanceof Error ? createError.message : "Failed to create task."}
        </p>
      )}
    </section>
  );
}

export default DashbordFocus;
