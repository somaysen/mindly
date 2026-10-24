"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Clock3, Flag, Plus, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";
import {
  useTaskDeleteById,
  useTaskUpdate,
} from "@/features/tasks/hooks/useTesk";
import { useGetProjects } from "@/features/projects/hooks/useProject";

interface TaskModelTask {
  _id: string;
  taskName: string;
  description?: string;
  dueDate?: string | null;
  dueTime?: string | null;
  priority?: string;
  checklist?: unknown[];
  project?: unknown;
}

interface ProjectOption {
  id: string;
  name: string;
}

interface TaskModelProps {
  task: TaskModelTask;
  onClose: () => void;
  onUpdated?: () => void;
  onDeleted?: () => void;
}

const dateForInput = (value?: string | null) => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toISOString().slice(0, 10);
};

const timeForInput = (value?: string | null) => {
  if (!value) return "";
  if (/^\d{2}:\d{2}/.test(value)) return value.slice(0, 5);

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toTimeString().slice(0, 5);
};

function getProjectOptions(
  response: unknown,
  depth = 0,
): ProjectOption[] {
  if (depth > 5 || !response) return [];

  if (Array.isArray(response)) {
    return response.flatMap((item) => {
      if (!item || typeof item !== "object") return [];

      const record = item as Record<string, unknown>;
      const id =
        record.id ??
        record.projectId ??
        record.projectID ??
        record.project_id ??
        record._id;

      const name =
        record.projectName ??
        record.projectTitle ??
        record.name ??
        record.title;

      return id != null && typeof name === "string"
        ? [{ id: String(id), name }]
        : [];
    });
  }

  if (typeof response !== "object") return [];

  const record = response as Record<string, unknown>;

  for (const key of ["data", "projects", "projectList", "items", "result"]) {
    const projects = getProjectOptions(record[key], depth + 1);
    if (projects.length) return projects;
  }

  return [];
}

const inputClass =
  "h-9 w-full rounded-lg border border-[#3b3a63] bg-[#1b1a3b] px-3 text-sm text-white outline-none transition focus:border-[#7375f4] disabled:opacity-60";

const labelClass = "mb-1 block text-xs font-medium text-white/70";

export default function TaskModel({
  task,
  onClose,
  onUpdated,
  onDeleted,
}: TaskModelProps) {
  const initialProject =
    typeof task?.project === "string" || typeof task?.project === "number"
      ? String(task.project)
      : task?.project && typeof task.project === "object"
        ? String(
            (task.project as Record<string, unknown>).id ??
              (task.project as Record<string, unknown>).projectId ??
              (task.project as Record<string, unknown>).projectID ??
              (task.project as Record<string, unknown>).project_id ??
              (task.project as Record<string, unknown>)._id ??
              "",
          )
        : "";
  const [taskName, setTaskName] = useState(task.taskName ?? "");
  const [description, setDescription] = useState(task.description ?? "");
  const [dueDate, setDueDate] = useState(dateForInput(task.dueDate));
  const [dueTime, setDueTime] = useState(timeForInput(task.dueTime));
  const [priority, setPriority] = useState(task.priority ?? "");
  const [projectId, setProjectId] = useState(initialProject);
  const [checklist, setChecklist] = useState<string[]>(
    Array.isArray(task.checklist)
      ? task.checklist.filter((item): item is string => typeof item === "string")
      : [],
  );
  const [newChecklistItem, setNewChecklistItem] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const { data: projectsData, isLoading: isProjectsLoading } =
    useGetProjects();

  const projects = useMemo(
    () => getProjectOptions(projectsData),
    [projectsData],
  );

  const { mutateAsync: updateTask, isPending: isUpdating } =
    useTaskUpdate();

  const { mutateAsync: deleteTask, isPending: isDeleting } =
    useTaskDeleteById();

  const isPending = isUpdating || isDeleting;

  const handleUpdate = async () => {
    const name = taskName.trim();

    if (!name) {
      toast.error("Please enter a task name.");
      return;
    }

    const formData = new FormData();

    formData.append("taskName", name);
    formData.append("description", description.trim());
    if (dueDate) formData.append("dueDate", dueDate);
    if (dueTime) formData.append("dueTime", dueTime);
    if (priority) formData.append("priority", priority);
    if (projectId) formData.append("project", projectId);
    formData.append("checklist", JSON.stringify(checklist));

    try {
      await updateTask({ taskId: task._id, data: formData });
      toast.success("Task updated.");
      onUpdated?.();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update task.",
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task._id);
      toast.success("Task deleted.");
      onDeleted?.();
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not delete task.",
      );
    }
  };

  const addChecklistItem = () => {
    const item = newChecklistItem.trim();
    if (!item) return;

    setChecklist((current) => [...current, item]);
    setNewChecklistItem("");
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close task editor"
        onClick={isPending ? undefined : onClose}
        className="absolute inset-0 cursor-default bg-[#080719]/75 backdrop-blur-[4px]"
      />

      {/* Compact Modal */}
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-model-title"
        className="relative z-10 flex max-h-[90dvh] w-full max-w-[460px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#252452] text-white shadow-2xl"
      >
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <h2
              id="task-model-title"
              className="text-base font-semibold"
            >
              Edit task
            </h2>
            <p className="mt-0.5 text-xs text-white/50">
              Update your task details
            </p>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </header>

        {/* Scrollable Form */}
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          {/* Task Name */}
          <div>
            <label htmlFor="task-model-name" className={labelClass}>
              Task name
            </label>

            <input
              id="task-model-name"
              autoFocus
              value={taskName}
              onChange={(event) => setTaskName(event.target.value)}
              placeholder="What needs to be done?"
              disabled={isPending}
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-model-description"
              className={labelClass}
            >
              Description
            </label>

            <textarea
              id="task-model-description"
              rows={2}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add details (optional)"
              disabled={isPending}
              className={`${inputClass} h-16 resize-none py-2`}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className={labelClass}>Due date</span>

              <div className="relative">
                <CalendarDays
                  size={15}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40"
                />

                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                  disabled={isPending}
                  className={`${inputClass} pl-8 pr-1 text-xs`}
                />
              </div>
            </label>

            <label>
              <span className={labelClass}>Due time</span>

              <div className="relative">
                <Clock3
                  size={15}
                  className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40"
                />

                <input
                  type="time"
                  value={dueTime}
                  onChange={(event) => setDueTime(event.target.value)}
                  disabled={isPending}
                  className={`${inputClass} pl-8 pr-1 text-xs`}
                />
              </div>
            </label>
          </div>

          {/* Priority */}
          <div className="flex h-9 items-center gap-2 rounded-lg border border-[#3b3a63] bg-[#1b1a3b] px-3">
            <Flag size={15} className="shrink-0 text-white/45" />

            <span className="text-xs text-white/65">Priority</span>

            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              disabled={isPending}
              className="ml-auto max-w-[130px] bg-transparent text-sm capitalize text-white outline-none"
            >
              <option value="" className="bg-[#1b1a3b]">
                None
              </option>
              <option value="low" className="bg-[#1b1a3b]">
                Low
              </option>
              <option value="medium" className="bg-[#1b1a3b]">
                Medium
              </option>
              <option value="high" className="bg-[#1b1a3b]">
                High
              </option>
            </select>
          </div>

          {/* Project */}
          <div>
            <label htmlFor="task-model-project" className={labelClass}>
              Link to project
            </label>

            <select
              id="task-model-project"
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              disabled={isProjectsLoading || isPending}
              className={inputClass}
            >
              <option value="" className="bg-[#1b1a3b]">
                No project
              </option>

              {projects.map((project) => (
                <option
                  key={project.id}
                  value={project.id}
                  className="bg-[#1b1a3b]"
                >
                  {project.name}
                </option>
              ))}
            </select>

            {isProjectsLoading && (
              <p className="mt-1 text-xs text-white/45">
                Loading projects...
              </p>
            )}

            {!isProjectsLoading && projects.length === 0 && (
              <p className="mt-1 text-xs text-white/45">
                No projects available.
              </p>
            )}
          </div>

          {/* Checklist */}
          <div>
            <label htmlFor="task-model-checklist" className={labelClass}>
              Checklist
            </label>

            {checklist.length > 0 && (
              <ul className="mb-2 max-h-28 space-y-1.5 overflow-y-auto">
                {checklist.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="flex items-center gap-2 rounded-lg border border-[#3b3a63] bg-[#1b1a3b] px-2.5 py-1.5"
                  >
                    <span
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0 rounded border border-[#5b5983]"
                    />

                    <span className="min-w-0 flex-1 break-words text-xs text-white/80">
                      {item}
                    </span>

                    <button
                      type="button"
                      aria-label={`Remove ${item}`}
                      disabled={isPending}
                      onClick={() =>
                        setChecklist((current) =>
                          current.filter(
                            (_, itemIndex) => itemIndex !== index,
                          ),
                        )
                      }
                      className="shrink-0 rounded p-1 text-white/45 hover:bg-white/10 hover:text-white disabled:opacity-50"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="flex gap-2">
              <input
                id="task-model-checklist"
                value={newChecklistItem}
                onChange={(event) =>
                  setNewChecklistItem(event.target.value)
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addChecklistItem();
                  }
                }}
                placeholder="Add checklist item"
                disabled={isPending}
                className={`${inputClass} min-w-0 flex-1`}
              />

              <button
                type="button"
                onClick={addChecklistItem}
                disabled={!newChecklistItem.trim() || isPending}
                aria-label="Add checklist item"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#6265ed] transition hover:bg-[#7375f4] disabled:opacity-50"
              >
                <Plus size={17} />
              </button>
            </div>
          </div>

          {/* Delete Confirmation */}
          {confirmDelete && (
            <div className="rounded-lg border border-red-400/20 bg-red-400/10 p-3">
              <p className="text-sm font-medium text-red-100">
                Delete this task?
              </p>

              <p className="mt-1 text-xs text-red-100/65">
                This action cannot be undone.
              </p>

              <div className="mt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  disabled={isPending}
                  className="h-8 rounded-lg border border-white/15 px-3 text-xs hover:bg-white/5 disabled:opacity-50"
                >
                  Keep task
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="h-8 rounded-lg bg-red-500 px-3 text-xs font-semibold hover:bg-red-400 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete task"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-white/10 bg-[#252452] px-4 py-3">
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            disabled={isPending || confirmDelete}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 text-xs text-red-300 transition hover:bg-red-400/10 disabled:opacity-50"
          >
            <Trash2 size={15} />
            Delete
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="h-9 rounded-lg border border-white/15 px-3 text-xs text-white/75 transition hover:bg-white/5 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleUpdate}
              disabled={!taskName.trim() || isPending}
              className="h-9 rounded-lg bg-[#6265ed] px-4 text-xs font-semibold transition hover:bg-[#7375f4] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save changes"}
            </button>
          </div>
        </footer>
      </section>
    </div>
  );
}
