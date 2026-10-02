"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CalendarDays, Clock3, X } from "lucide-react";
import { toast } from "react-toastify";
import { useTaskCreate } from "@/features/tasks/hooks/useTesk";

interface CreateTaskModalProps {
  dueDate: string;
  onClose: () => void;
}

export default function CreateTaskModal({ dueDate, onClose }: CreateTaskModalProps) {
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueTime, setDueTime] = useState("");
  const { mutateAsync: createTask, isPending } = useTaskCreate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!taskName.trim()) return;

    const formData = new FormData();
    formData.append("taskName", taskName.trim());
    formData.append("description", description.trim());
    formData.append("dueDate", dueDate);
    if (dueTime) formData.append("dueTime", dueTime);
    formData.append("priority", "medium");
    formData.append("status", "todo");
    formData.append("checklist", JSON.stringify([]));

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
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close create task dialog"
        className="absolute inset-0 cursor-default bg-[#080719]/75 backdrop-blur-[6px]"
        onClick={isPending ? undefined : onClose}
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-[520px] rounded-[22px] border border-white/10 bg-[#252452] p-6 text-white shadow-2xl sm:p-7"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Create task</h2>
            <p className="mt-1 text-sm text-white/55">Add a task for this date.</p>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            disabled={isPending}
            className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
          >
            <X size={19} />
          </button>
        </div>

        <label className="mb-2 block text-sm font-medium text-white/75" htmlFor="calendar-task-name">
          Task name
        </label>
        <input
          id="calendar-task-name"
          autoFocus
          required
          value={taskName}
          onChange={(event) => setTaskName(event.target.value)}
          placeholder="What needs to be done?"
          className="h-12 w-full rounded-xl border border-[#3b3a63] bg-[#1b1a3b] px-4 text-sm outline-none placeholder:text-white/30 focus:border-[#7375f4]"
        />

        <label className="mb-2 mt-5 block text-sm font-medium text-white/75" htmlFor="calendar-task-description">
          Description
        </label>
        <textarea
          id="calendar-task-description"
          rows={3}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Add details (optional)"
          className="w-full resize-none rounded-xl border border-[#3b3a63] bg-[#1b1a3b] px-4 py-3 text-sm outline-none placeholder:text-white/30 focus:border-[#7375f4]"
        />

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="relative block">
            <span className="mb-2 block text-sm font-medium text-white/75">Date</span>
            <CalendarDays size={16} className="pointer-events-none absolute bottom-[15px] left-3 text-white/45" />
            <input
              type="date"
              value={dueDate}
              readOnly
              className="h-11 w-full rounded-xl border border-[#3b3a63] bg-[#1b1a3b] pl-9 pr-2 text-sm text-white/80 outline-none"
            />
          </label>
          <label className="relative block">
            <span className="mb-2 block text-sm font-medium text-white/75">Time <span className="text-white/40">(optional)</span></span>
            <Clock3 size={16} className="pointer-events-none absolute bottom-[15px] left-3 text-white/45" />
            <input
              type="time"
              value={dueTime}
              onChange={(event) => setDueTime(event.target.value)}
              className="h-11 w-full rounded-xl border border-[#3b3a63] bg-[#1b1a3b] pl-9 pr-2 text-sm text-white/80 outline-none focus:border-[#7375f4]"
            />
          </label>
        </div>

        <div className="mt-7 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-11 rounded-full border border-white/15 px-5 text-sm text-white/75 transition hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!taskName.trim() || isPending}
            className="h-11 min-w-32 rounded-full bg-[#6265ed] px-5 text-sm font-semibold transition hover:bg-[#7375f4] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Creating…" : "Create task"}
          </button>
        </div>
      </form>
    </div>
  );
}
