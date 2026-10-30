"use client";

import { Check, ListTodo } from "lucide-react";

import { useTaskGet } from "@/features/tasks/hooks/useTesk";
import TaskCard from "./TaskCard";

interface AllTaskProps {
  onAddTask: () => void;
}

export default function AllTask({ onAddTask }: AllTaskProps) {
  const { data, isLoading, isError } = useTaskGet();
  const tasks = [...(data?.data ?? [])].sort((a, b) =>
    (a.dueDate ?? "9999-99-99").localeCompare(b.dueDate ?? "9999-99-99") ||
    (a.dueTime ?? "99:99").localeCompare(b.dueTime ?? "99:99"),
  );

  return (
    <section className="min-w-0 px-1 pb-8 pt-2 sm:px-5">
      <header className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-semibold tracking-[-0.02em] sm:text-[28px]">
            All Tasks
          </h1>
          <p className="mt-2 text-sm text-white/55">Every task in one place.</p>
        </div>
        <button
          type="button"
          onClick={onAddTask}
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full bg-[#6265ed] px-4 text-sm font-medium text-white transition hover:bg-[#7375f4]"
        >
          <ListTodo size={16} /> Add task
        </button>
      </header>

      {isLoading ? (
        <div className="rounded-2xl border border-[#383653] bg-[#191832]/90 p-5 text-sm text-white/55">
          Loading tasks...
        </div>
      ) : isError ? (
        <div role="alert" className="rounded-2xl border border-rose-400/20 bg-[#21182e] p-5 text-sm text-rose-200">
          Could not load tasks. Please try again.
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#4b496f] bg-[#191832]/65 px-5 py-10 text-center">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl border border-[#6669ef]/20 bg-[#6669ef]/10 text-[#a5a7ff]">
            <Check size={20} />
          </span>
          <h2 className="mt-3 text-sm font-semibold text-[#f1f0ff]">No tasks yet</h2>
          <p className="mt-1 text-xs text-[#9291b3]">Your tasks will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              className="rounded-2xl border border-[#383653] bg-[#191832]/90 p-4 transition hover:border-[#5b5884] sm:p-5"
            />
          ))}
        </div>
      )}
    </section>
  );
}
