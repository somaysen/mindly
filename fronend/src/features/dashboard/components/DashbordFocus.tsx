"use client";

import { Plus } from "lucide-react";

interface Task {
  _id: string;
  taskName: string;
  description?: string;
  dueDate?: string;
  dueTime?: string;
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
  return (
    <div className="mt-8">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-[family-name:var(--font-bricolage-grotesque)] text-lg font-medium">
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
        <div className="flex min-h-[70px] items-center rounded-[17px] border border-[#3d3b5c] bg-[#171633] px-4">
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 animate-pulse rounded-full bg-white/20" />

            <p className="text-sm text-white/50">Loading tasks...</p>
          </div>
        </div>
      )}

      {/* GET TASK ERROR */}
      {isTasksGetError && !isTasksLoading && (
        <div className="rounded-[17px] border border-red-500/30 bg-[#171633] p-4">
          <p className="text-sm text-red-400">Failed to load tasks.</p>
        </div>
      )}

      {/* TASK LIST */}
      {!isTasksLoading && !isTasksGetError && tasks.length > 0 && (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="group flex min-h-[70px] items-center gap-3 rounded-[17px] border border-[#3d3b5c] bg-[#171633] px-4 transition hover:border-[#7775a0]"
            >
              {/* CHECKBOX */}
              <button
                type="button"
                aria-label={`Complete ${task.taskName}`}
                className="h-5 w-5 shrink-0 rounded-full border border-white/30 transition hover:border-[#5965ed] hover:bg-[#5965ed]/10"
              />

              {/* TASK INFORMATION */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {task.taskName || "Untitled Task"}
                </p>

                {task.description && (
                  <p className="mt-1 truncate text-xs text-white/40">
                    {task.description}
                  </p>
                )}

                {/* DATE + TIME */}
                {(task.dueDate || task.dueTime) && (
                  <div className="mt-1 flex gap-2 text-[11px] text-white/30">
                    {task.dueDate && (
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    )}

                    {task.dueTime && <span>{task.dueTime}</span>}
                  </div>
                )}
              </div>

              {/* PRIORITY */}
              {task.priority && (
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase ${
                    task.priority === "high"
                      ? "bg-red-500/10 text-red-400"
                      : task.priority === "medium"
                        ? "bg-yellow-500/10 text-yellow-400"
                        : "bg-green-500/10 text-green-400"
                  }`}
                >
                  {task.priority}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* NO TASKS */}
      {!isTasksLoading && !isTasksGetError && tasks.length === 0 && (
        <button
          type="button"
          onClick={handleCreateTask}
          disabled={isCreatingTask}
          className="flex h-14 w-full items-center gap-3 rounded-[17px] border border-dashed border-[#585675] bg-[#171633] px-4 text-sm text-white/50 transition hover:border-[#7775a0] hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus size={26} strokeWidth={1.5} />

          {isCreatingTask ? "Creating task..." : "Create your first task"}
        </button>
      )}

      {/* CREATE SUCCESS */}
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
