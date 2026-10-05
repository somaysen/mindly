"use client";

import { Plus, Pin } from "lucide-react";
import { useEffect, useState } from "react";

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

  /*
   * Load pinned tasks
   */
  useEffect(() => {
    try {
      const savedPins = localStorage.getItem("pinnedTasks");

      if (savedPins) {
        setPinnedTasks(JSON.parse(savedPins));
      }
    } catch (error) {
      console.error("Failed to load pinned tasks:", error);
    }
  }, []);

  /*
   * Pin / Unpin task
   */
  const handlePinTask = (taskId: string) => {
    setPinnedTasks((currentPinned) => {
      let updatedPinned: string[];

      if (currentPinned.includes(taskId)) {
        // UNPIN
        updatedPinned = currentPinned.filter((id) => id !== taskId);
      } else {
        // PIN
        updatedPinned = [...currentPinned, taskId];
      }

      localStorage.setItem(
        "pinnedTasks",
        JSON.stringify(updatedPinned)
      );

      return updatedPinned;
    });
  };

  /*
   * Sort pinned tasks first
   */
  const sortedTasks = [...tasks].sort((a, b) => {
    const aPinned = pinnedTasks.includes(a._id);
    const bPinned = pinnedTasks.includes(b._id);

    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;

    return 0;
  });

  const getPriorityStyle = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-[#ffd6d6] text-[#b84c4c]";

      case "medium":
        return "bg-[#ffe9b8] text-[#a87518]";

      case "low":
        return "bg-[#ccefdc] text-[#43815b]";

      default:
        return "bg-white/10 text-white/50";
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "Today";

    const taskDate = new Date(date);
    const today = new Date();

    const isToday =
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear();

    if (isToday) return "Today";

    return taskDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="mt-8">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-bricolage-grotesque)] text-lg font-medium text-white">
          Today&apos;s Focus
        </h2>

        <button
          type="button"
          className="text-xs text-white/45 transition hover:text-white/75"
        >
          Show all
        </button>
      </div>

      {/* LOADING */}
      {isTasksLoading && (
        <div className="flex min-h-[120px] items-center rounded-[18px] border border-[#37345a] bg-[#191833] px-5">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 animate-pulse rounded-full bg-white/20" />

            <p className="text-sm text-white/50">
              Loading tasks...
            </p>
          </div>
        </div>
      )}

      {/* ERROR */}
      {isTasksGetError && !isTasksLoading && (
        <div className="rounded-[18px] border border-red-500/20 bg-[#191833] p-5">
          <p className="text-sm text-red-400">
            Failed to load tasks.
          </p>
        </div>
      )}

      {/* TASK LIST */}
      {!isTasksLoading &&
        !isTasksGetError &&
        sortedTasks.length > 0 && (
          <div className="space-y-3">
            {sortedTasks.map((task) => {
              const isPinned = pinnedTasks.includes(task._id);

              return (
                <div
                  key={task._id}
                  className={`group relative min-h-[124px] rounded-[18px] border px-5 py-4 transition-all duration-200 ${
                    isPinned
                      ? "border-[#464276] bg-[#1b1938]"
                      : "border-[#37345a] bg-[#191833]"
                  } hover:border-[#504b78] hover:bg-[#1c1a3a]`}
                >
                  {/* TOP ROW */}
                  <div className="mb-3 flex items-center justify-between">
                    {/* PINNED LABEL */}
                    <div
                      className={`flex items-center gap-2 transition ${
                        isPinned
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <Pin
                        size={13}
                        strokeWidth={2.5}
                        className={`rotate-[-20deg] ${
                          isPinned
                            ? "fill-[#7074ee] text-[#7074ee]"
                            : "text-white/30"
                        }`}
                      />

                      <span
                        className={`text-[10px] font-medium ${
                          isPinned
                            ? "text-[#7779d9]"
                            : "text-white/30"
                        }`}
                      >
                        {isPinned ? "Pinned" : "Pin task"}
                      </span>
                    </div>

                    {/* PIN BUTTON */}
                    <button
                      type="button"
                      onClick={() => handlePinTask(task._id)}
                      aria-label={
                        isPinned
                          ? `Unpin ${task.taskName}`
                          : `Pin ${task.taskName}`
                      }
                      title={isPinned ? "Unpin task" : "Pin task"}
                      className={`ml-auto rounded-full p-1.5 transition-all ${
                        isPinned
                          ? "text-[#7074ee] hover:bg-[#7074ee]/10"
                          : "text-white/25 opacity-0 group-hover:opacity-100 hover:bg-white/5 hover:text-white/60"
                      }`}
                    >
                      <Pin
                        size={14}
                        strokeWidth={2}
                        className={isPinned ? "fill-current" : ""}
                      />
                    </button>
                  </div>

                  {/* TASK ROW */}
                  <div className="flex items-center gap-3">
                    {/* CHECKBOX */}
                    <button
                      type="button"
                      aria-label={`Complete ${task.taskName}`}
                      className="h-[15px] w-[15px] shrink-0 rounded-[3px] border-[1.5px] border-white/70 transition-all hover:border-[#7779ed] hover:bg-[#7779ed]/10"
                    />

                    {/* TITLE */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium text-white">
                        {task.taskName || "Untitled Task"}
                      </p>
                    </div>

                    {/* PRIORITY */}
                    {task.priority && (
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium capitalize ${getPriorityStyle(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    )}
                  </div>

                  {/* META */}
                  <div className="ml-7 mt-3 flex items-center gap-2">
                    {/* CATEGORY */}
                    <span className="flex items-center gap-1 rounded-full bg-[#24223f] px-2 py-1 text-[9px] text-[#aaa6c8]">
                      <span className="h-1 w-1 rounded-full bg-[#f4a900]" />
                      Design Class
                    </span>

                    {/* DATE */}
                    <span className="text-[10px] text-white/40">
                      {formatDate(task.dueDate)}
                    </span>

                    {/* TIME */}
                    {task.dueTime && (
                      <>
                        <span className="text-[10px] text-white/20">
                          •
                        </span>

                        <span className="text-[10px] text-white/40">
                          {task.dueTime}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      {/* NO TASKS */}
      {!isTasksLoading &&
        !isTasksGetError &&
        tasks.length === 0 && (
          <button
            type="button"
            onClick={handleCreateTask}
            disabled={isCreatingTask}
            className="flex h-14 w-full items-center gap-3 rounded-[17px] border border-dashed border-[#585675] bg-[#171633] px-4 text-sm text-white/50 transition hover:border-[#7775a0] hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={26} strokeWidth={1.5} />

            {isCreatingTask
              ? "Creating task..."
              : "Create your first task"}
          </button>
        )}

      {/* SUCCESS */}
      {isTaskCreated && !isCreateError && (
        <p className="mt-2 text-sm text-green-400">
          Task created successfully.
        </p>
      )}

      {/* CREATE ERROR */}
      {isCreateError && (
        <p className="mt-2 text-sm text-red-400">
          {createError instanceof Error
            ? createError.message
            : "Failed to create task"}
        </p>
      )}
    </div>
  );
}

export default DashbordFocus;