"use client";

import { useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  Loader2,
  Plus,
  Sparkles,
} from "lucide-react";
import TaskCard from "@/features/tasks/components/TaskCard";

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

const pad = (value: number) => String(value).padStart(2, "0");

function getLocalDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
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

  const today = getLocalDateKey(new Date());
  const todayTasks = tasks.filter((task) => task.dueDate?.slice(0, 10) === today);
  const sortedTasks = [...todayTasks].sort((first, second) => {
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
            {todayTasks.length}
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
          {visibleTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              isPinned={pinnedTasks.includes(task._id)}
              onPinToggle={handlePinTask}
              className="rounded-2xl border border-[#383653] bg-[#191832]/90 p-4 transition duration-200 hover:-translate-y-px hover:border-[#5b5884] hover:bg-[#1d1b3d] sm:p-5"
            />
          ))}
        </div>
      )}

      {!isTasksLoading && !isTasksGetError && todayTasks.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[#4b496f] bg-[#191832]/65 px-5 py-8 text-center sm:py-9">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl border border-[#6669ef]/20 bg-[#6669ef]/10 text-[#a5a7ff]">
            <Sparkles size={20} />
          </span>
          <h3 className="mt-3 text-sm font-semibold text-[#f1f0ff]">A clear space to begin</h3>
          <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-[#9291b3]">No tasks are scheduled for today. Add one small task and build momentum from there.</p>
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
