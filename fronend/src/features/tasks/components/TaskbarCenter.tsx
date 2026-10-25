"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowDownUp,
  CalendarDays,
  Check,
  FilePenLine,
  Flag,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import Calendar from "@/components/Calendar";
import { useTaskGet, useTaskUpdate } from "@/features/tasks/hooks/useTesk";
import type { Task } from "@/types/task";
import TaskSchedule from "./TaskSchedule";
import CreateTaskModal from "./CreateTaskModal";
import TaskModel from "./taskModel";
import { toast } from "react-toastify";

type EditableTask = {
  _id: string;
  taskName: string;
  description?: string;
  dueDate?: string;
  dueTime?: string;
  priority?: string;
  checklist?: string[];
  project?: string;
};

const formatDueDate = (value: string | null) => {
  if (!value) return "No due date";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
};

const getTodayInputDate = () => {
  const today = new Date();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
};

function toEditableTask(task: Task): EditableTask {
  const linkedProject = (task as Task & { project?: unknown }).project;
  const projectId =
    typeof linkedProject === "string" || typeof linkedProject === "number"
      ? String(linkedProject)
      : linkedProject && typeof linkedProject === "object"
        ? String(
            (linkedProject as Record<string, unknown>).id ??
              (linkedProject as Record<string, unknown>).projectId ??
              (linkedProject as Record<string, unknown>).projectID ??
              (linkedProject as Record<string, unknown>).project_id ??
              (linkedProject as Record<string, unknown>)._id ??
              "",
          )
        : "";

  return {
    _id: task._id,
    taskName: task.taskName,
    description: task.description,
    dueDate: task.dueDate ?? undefined,
    dueTime: task.dueTime ?? undefined,
    priority: task.priority,
    checklist: Array.isArray(task.checklist)
      ? task.checklist.filter((item): item is string => typeof item === "string")
      : [],
    project: projectId,
  };
}

function TaskbarCenter() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<EditableTask | null>(null);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const { data, isLoading, isError } = useTaskGet();
  const { mutateAsync: updateTask, isPending: isUpdatingTask } = useTaskUpdate();

  const toggleTaskCompletion = async (task: Task) => {
    const formData = new FormData();
    formData.append("status", task.status === "completed" ? "todo" : "completed");

    try {
      await updateTask({ taskId: task._id, data: formData });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update task status.");
    }
  };

  const tasks = useMemo(() => {
    const allTasks = Array.isArray(data?.data) ? data.data : [];
    const query = search.trim().toLocaleLowerCase();

    return allTasks.filter((task) =>
      !query ||
      task.taskName.toLocaleLowerCase().includes(query) ||
      task.description?.toLocaleLowerCase().includes(query),
    );
  }, [data, search]);

  const visibleTasks = showAll ? tasks : tasks.slice(0, 4);
  const taskCount = Array.isArray(data?.data) ? data.data.length : 0;

  return (
    <main className="min-h-screen flex-1 overflow-y-auto overflow-x-hidden px-6 pb-6 pt-15 text-white">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_285px]">
          <section className="min-w-0">
            <div className="relative flex h-[190px] w-full items-start justify-between overflow-hidden">
              <div className="relative z-20">
                <h1 className="text-[25px] font-semibold">
                  {isLoading ? "Loading your tasks..." : taskCount ? "Your plans, in one place" : "Nothing planned yet"}
                </h1>
                <p className="mt-2 max-w-[250px] text-[12px] leading-5 text-[#A6A6BD]">
                  {taskCount
                    ? `${taskCount} ${taskCount === 1 ? "task" : "tasks"} ready for you. Keep your next step in focus.`
                    : "Create your first task and start building momentum."}
                </p>
              </div>
              <img
                src="/images/girl laptop 02 1.png"
                alt="Person planning tasks on a laptop"
                className="pointer-events-none absolute right-0 top-1/2 w-[250px] -translate-x-1/2 -translate-y-1/2 object-contain"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-5">
              <label className="flex h-11 w-full max-w-[400px] items-center gap-2 rounded-full border border-[#30304D] bg-[#18172F] px-3">
                <Search size={18} className="shrink-0 text-[#A9AAC8]" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tasks..."
                  aria-label="Search tasks"
                  className="w-full bg-transparent text-[12px] text-white outline-none placeholder:text-[#8D8DA8]"
                />
              </label>

              <div className="flex shrink-0 items-center gap-3">
                <button type="button" aria-label="Task filters" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#30304D] bg-[#18172F] text-[#A9AAC8]">
                  <SlidersHorizontal size={16} />
                </button>
                <button type="button" aria-label="Sort tasks" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#30304D] bg-[#18172F] text-[#A9AAC8]">
                  <ArrowDownUp size={16} />
                </button>
              </div>
            </div>

            <section className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[20px] font-medium">Your tasks</h2>
                <div className="flex items-center gap-4">
                  {tasks.length > 4 && (
                    <button type="button" onClick={() => setShowAll((value) => !value)} className="text-[13px] text-[#8588FA] transition hover:text-white">
                      {showAll ? "Show less" : "Show all"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="inline-flex items-center gap-1 rounded-full bg-[#5559ED] px-3 py-2 text-[12px] font-medium transition hover:bg-[#6569f5]"
                  >
                    <Plus size={15} /> Add task
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex min-h-[145px] items-center justify-center rounded-lg border border-[#252442] bg-[#191832] text-sm text-[#A6A6BD]">
                  Loading tasks...
                </div>
              ) : isError ? (
                <div role="alert" className="flex min-h-[145px] flex-col items-center justify-center rounded-lg border border-red-400/20 bg-[#191832] text-sm text-red-300">
                  <p>We couldn’t load your tasks.</p>
                  <p className="mt-1 text-xs text-white/50">Please try again in a moment.</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="flex min-h-[190px] flex-col items-center justify-center rounded-lg border border-[#252442] bg-[#191832] px-4 text-center">
                  <FilePenLine size={25} className="mb-2 text-[#B5B5C9]" />
                  <p className="text-[15px] text-[#B5B5C9]">{search ? "No tasks match your search." : "No tasks yet."}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleTasks.map((task: Task) => (
                    <article key={task._id} className="rounded-xl border border-[#30304D] bg-[#191832] p-4 transition hover:border-[#4d4b78]">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <button
                            type="button"
                            role="checkbox"
                            aria-checked={task.status === "completed"}
                            aria-label={`${task.status === "completed" ? "Mark as incomplete" : "Mark as complete"}: ${task.taskName}`}
                            disabled={isUpdatingTask}
                            onClick={() => void toggleTaskCompletion(task)}
                            className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border transition disabled:cursor-wait disabled:opacity-60 ${task.status === "completed" ? "border-[#6468F2] bg-[#5559ED] text-white" : "border-[#62617F] text-transparent hover:border-[#8588FA]"}`}
                          >
                            <Check size={13} strokeWidth={3} />
                          </button>
                          <div className="min-w-0">
                            <h3 className={`truncate text-[15px] font-medium ${task.status === "completed" ? "text-[#A6A6BD] line-through" : "text-white"}`}>
                              {task.taskName}
                            </h3>
                            {task.description && <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#A6A6BD]">{task.description}</p>}
                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#A6A6BD]">
                              <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} />{formatDueDate(task.dueDate)}</span>
                              {task.dueTime && <span>{task.dueTime}</span>}
                              {task.priority && <span className="inline-flex items-center gap-1 capitalize"><Flag size={12} />{task.priority} priority</span>}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setEditingTask(toEditableTask(task))}
                          aria-label={`Edit ${task.taskName}`}
                          className="shrink-0 rounded-full border border-[#393858] p-2 text-[#A9AAC8] transition hover:border-[#6468F2] hover:text-white"
                        >
                          <FilePenLine size={16} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </section>

          <aside className="flex w-full flex-col gap-4 xl:w-[285px]">
            <div className="overflow-hidden rounded-xl border border-[#30304D] bg-[#191832]"><Calendar /></div>
            <div className="overflow-hidden rounded-xl border border-[#30304D] bg-[#191832]"><TaskSchedule /></div>
          </aside>
        </div>
      </div>

      {isCreateOpen && <CreateTaskModal dueDate={getTodayInputDate()} onClose={() => setIsCreateOpen(false)} />}
      {editingTask && (
        <TaskModel
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onUpdated={() => setEditingTask(null)}
          onDeleted={() => setEditingTask(null)}
        />
      )}
    </main>
  );
}

export default TaskbarCenter;
