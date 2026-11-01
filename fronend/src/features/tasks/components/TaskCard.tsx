"use client";

import { useState } from "react";
import { CalendarDays, Check, FilePenLine, Flag, Pin } from "lucide-react";
import { toast } from "react-toastify";

import { useTaskComplete } from "@/features/tasks/hooks/useTesk";
import TaskModel from "./taskModel";

export interface TaskCardTask {
  _id: string;
  taskName: string;
  description?: string | null;
  dueDate?: string | null;
  dueTime?: string | null;
  priority?: string;
  status?: string;
  checklist?: unknown[];
  project?: unknown;
}

interface TaskCardProps {
  task: TaskCardTask;
  className?: string;
  isPinned?: boolean;
  onPinToggle?: (taskId: string) => void;
}

function formatDueDate(value?: string | null) {
  if (!value) return "No due date";

  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return value;

  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: year === new Date().getFullYear() ? undefined : "numeric",
  });
}

function TaskCard({
  task,
  className = "rounded-xl border border-[#30304D] bg-[#191832] p-4 transition hover:border-[#4d4b78]",
  isPinned = false,
  onPinToggle,
}: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { mutateAsync: completeTask, isPending: isCompleting } = useTaskComplete();
  const isCompleted = task.status === "completed";

  const toggleCompletion = async () => {
    const data = new FormData();
    data.append("status", isCompleted ? "todo" : "completed");

    try {
      await completeTask({ taskId: task._id, data });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update task status.");
    }
  };

  return (
    <>
      <article className={`group relative ${className} ${isPinned ? "border-[#7779f2]/50" : ""}`}>
        {isPinned && <span aria-hidden="true" className="absolute inset-y-3 left-0 w-[3px] rounded-r-full bg-gradient-to-b from-[#8b8df8] to-[#6669ef]" />}
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <button
              type="button"
              role="checkbox"
              aria-checked={isCompleted}
              aria-label={`${isCompleted ? "Mark as incomplete" : "Mark as complete"}: ${task.taskName}`}
              disabled={isCompleting}
              onClick={() => void toggleCompletion()}
              className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded border transition disabled:cursor-wait disabled:opacity-60 ${isCompleted ? "border-[#6468F2] bg-[#5559ED] text-white" : "border-[#62617F] text-transparent hover:border-[#8588FA]"}`}
            >
              <Check size={13} strokeWidth={3} />
            </button>
            <div className="min-w-0 flex-1">
              <h3 className={`truncate text-[15px] font-medium ${isCompleted ? "text-[#A6A6BD] line-through" : "text-white"}`}>
                {task.taskName || "Untitled task"}
              </h3>
              {task.description && <p className="mt-1 line-clamp-2 text-[12px] leading-5 text-[#A6A6BD]">{task.description}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#A6A6BD]">
                <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} />{formatDueDate(task.dueDate)}</span>
                {task.dueTime && <span>{task.dueTime}</span>}
                {task.priority && <span className="inline-flex items-center gap-1 capitalize"><Flag size={12} />{task.priority} priority</span>}
              </div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {onPinToggle && (
              <button
                type="button"
                onClick={() => onPinToggle(task._id)}
                aria-label={isPinned ? `Unpin ${task.taskName}` : `Pin ${task.taskName}`}
                aria-pressed={isPinned}
                className={`grid h-9 w-9 place-items-center rounded-full transition ${isPinned ? "bg-[#6669ef]/15 text-[#aaaaff]" : "text-[#716f91] hover:bg-white/[0.06] hover:text-[#c4c3e2]"}`}
              >
                <Pin size={15} className={isPinned ? "rotate-[-25deg] fill-current" : ""} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              aria-label={`Edit ${task.taskName}`}
              className="rounded-full border border-[#393858] p-2 text-[#A9AAC8] transition hover:border-[#6468F2] hover:text-white"
            >
              <FilePenLine size={16} />
            </button>
          </div>
        </div>
      </article>

      {isEditing && (
        <TaskModel
          task={{
            _id: task._id,
            taskName: task.taskName,
            description: task.description ?? undefined,
            dueDate: task.dueDate,
            dueTime: task.dueTime,
            priority: task.priority,
            checklist: task.checklist,
            project: task.project,
          }}
          onClose={() => setIsEditing(false)}
          onUpdated={() => setIsEditing(false)}
          onDeleted={() => setIsEditing(false)}
        />
      )}
    </>
  );
}

export default TaskCard;
