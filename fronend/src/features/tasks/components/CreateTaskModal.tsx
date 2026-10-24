"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { CalendarDays, Clock3, Plus, X } from "lucide-react";
import { toast } from "react-toastify";

import { useTaskCreate } from "@/features/tasks/hooks/useTesk";
import { useGetProjects } from "@/features/projects/hooks/useProject";

interface CreateTaskModalProps {
  dueDate: string;
  onClose: () => void;
}

interface ProjectOption {
  id: string;
  name: string;
}

const inputClass =
  "h-10 w-full rounded-lg border border-[#3b3a63] bg-[#1b1a3b] px-3 text-sm text-white outline-none transition focus:border-[#7375f4] disabled:opacity-60";
const labelClass = "mb-1 block text-xs font-medium text-white/70";

function getProjectOptions(response: unknown, depth = 0): ProjectOption[] {
  if (depth > 5 || !response) return [];
  if (Array.isArray(response)) {
    return response.flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const project = item as Record<string, unknown>;
      const id = project.id ?? project.projectId ?? project.projectID ?? project.project_id ?? project._id;
      const name = project.projectName ?? project.projectTitle ?? project.name ?? project.title;
      return id != null && typeof name === "string" ? [{ id: String(id), name }] : [];
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

export default function CreateTaskModal({ dueDate, onClose }: CreateTaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [projectId, setProjectId] = useState("");
  const [checklist, setChecklist] = useState<string[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  const { mutateAsync: createTask, isPending } = useTaskCreate();
  const { data: projectsData, isLoading: isProjectsLoading } = useGetProjects();
  const projects = useMemo(() => getProjectOptions(projectsData), [projectsData]);

  const addChecklistItem = () => {
    const item = newChecklistItem.trim();
    if (!item) return;
    setChecklist((current) => [...current, item]);
    setNewChecklistItem("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const name = taskName.trim();
    if (!name || isPending) return;

    const formData = new FormData();
    formData.append("taskName", name);
    formData.append("description", description.trim());
    formData.append("dueDate", dueDate);
    formData.append("dueTime", dueTime);
    formData.append("priority", "medium");
    formData.append("status", "todo");
    formData.append("project", projectId);
    formData.append("checklist", JSON.stringify(checklist));

    try {
      await createTask(formData);
      toast.success("Task created successfully.");
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create task.";
      toast.error(message);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-3 sm:p-4">
      <button
        type="button"
        aria-label="Close create task dialog"
        className="absolute inset-0 cursor-default bg-[#080719]/75 backdrop-blur-[4px]"
        onClick={isPending ? undefined : onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 flex max-h-[90dvh] w-full max-w-[460px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#252452] text-white shadow-2xl"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <h2 className="text-base font-semibold">Create task</h2>
            <p className="mt-0.5 text-xs text-white/50">Add a task for this date.</p>
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

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
          <div>
            <label className={labelClass} htmlFor="calendar-task-name">Task name</label>
            <input
              id="calendar-task-name"
              autoFocus
              required
              value={taskName}
              onChange={(event) => setTaskName(event.target.value)}
              placeholder="What needs to be done?"
              disabled={isPending}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass} htmlFor="calendar-task-description">Description</label>
            <textarea
              id="calendar-task-description"
              rows={2}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add details (optional)"
              disabled={isPending}
              className={`${inputClass} h-16 resize-none py-2`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className={labelClass}>Due date</span>
              <div className="relative">
                <CalendarDays size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input type="date" value={dueDate} readOnly disabled={isPending} className={`${inputClass} pl-8 pr-1 text-xs`} />
              </div>
            </label>
            <label>
              <span className={labelClass}>Due time</span>
              <div className="relative">
                <Clock3 size={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input type="time" value={dueTime} onChange={(event) => setDueTime(event.target.value)} disabled={isPending} className={`${inputClass} pl-8 pr-1 text-xs`} />
              </div>
            </label>
          </div>

          <div>
            <label className={labelClass} htmlFor="create-task-project">Link to project</label>
            <select
              id="create-task-project"
              value={projectId}
              onChange={(event) => setProjectId(event.target.value)}
              disabled={isProjectsLoading || isPending}
              className={inputClass}
            >
              <option value="" className="bg-[#1b1a3b]">No project</option>
              {projects.map((project) => <option key={project.id} value={project.id} className="bg-[#1b1a3b]">{project.name}</option>)}
            </select>
            {isProjectsLoading && <p className="mt-1 text-xs text-white/45">Loading projects...</p>}
            {!isProjectsLoading && projects.length === 0 && <p className="mt-1 text-xs text-white/45">No projects available.</p>}
          </div>

          <div>
            <label className={labelClass} htmlFor="create-task-checklist">Checklist</label>
            {checklist.length > 0 && (
              <ul className="mb-2 max-h-28 space-y-1.5 overflow-y-auto">
                {checklist.map((item, index) => (
                  <li key={`${item}-${index}`} className="flex items-center gap-2 rounded-lg border border-[#3b3a63] bg-[#1b1a3b] px-2.5 py-1.5">
                    <span aria-hidden="true" className="h-3.5 w-3.5 shrink-0 rounded border border-[#5b5983]" />
                    <span className="min-w-0 flex-1 break-words text-xs text-white/80">{item}</span>
                    <button type="button" aria-label={`Remove ${item}`} disabled={isPending} onClick={() => setChecklist((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="shrink-0 rounded p-1 text-white/45 hover:bg-white/10 hover:text-white disabled:opacity-50"><X size={14} /></button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <input
                id="create-task-checklist"
                value={newChecklistItem}
                onChange={(event) => setNewChecklistItem(event.target.value)}
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
              <button type="button" onClick={addChecklistItem} disabled={!newChecklistItem.trim() || isPending} aria-label="Add checklist item" className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#6265ed] transition hover:bg-[#7375f4] disabled:opacity-50"><Plus size={17} /></button>
            </div>
          </div>
        </div>

        <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-white/10 bg-[#252452] px-4 py-3">
          <button type="button" onClick={onClose} disabled={isPending} className="h-9 rounded-lg border border-white/15 px-3 text-xs text-white/75 transition hover:bg-white/5 disabled:opacity-50">Cancel</button>
          <button type="submit" disabled={!taskName.trim() || isPending} className="h-9 rounded-lg bg-[#6265ed] px-4 text-xs font-semibold transition hover:bg-[#7375f4] disabled:cursor-not-allowed disabled:opacity-50">{isPending ? "Creating..." : "Create task"}</button>
        </footer>
      </form>
    </div>
  );
}
