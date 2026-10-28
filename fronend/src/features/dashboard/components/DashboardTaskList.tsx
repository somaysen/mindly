"use client";

import { Check, ListTodo } from "lucide-react";

import { useTaskGet } from "@/features/tasks/hooks/useTesk";
import { useTaskCompleteGet } from "@/features/tasks/hooks/useTaskCompleteGet";
import TaskCard from "@/features/tasks/components/TaskCard";

type TaskListMode = "upcoming" | "completed";

const pad = (value: number) => String(value).padStart(2, "0");

function getLocalDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export default function DashboardTaskList({ mode }: { mode: TaskListMode }) {
  const upcoming = mode === "upcoming";
  const allTasksQuery = useTaskGet(undefined, upcoming);
  const completedTasksQuery = useTaskCompleteGet(undefined, !upcoming);
  const { data, isLoading, isError } = upcoming ? allTasksQuery : completedTasksQuery;
  const title = upcoming ? "Upcoming" : "Completed";
  const today = getLocalDateKey(new Date());
  const tasks = [...(data?.data ?? [])]
    .filter((task) => upcoming
      ? task.status !== "completed" && task.dueDate !== null && task.dueDate.slice(0, 10) > today
      : task.status === "completed",
    )
    .sort((a, b) => upcoming
      ? (a.dueDate ?? "9999-99-99").localeCompare(b.dueDate ?? "9999-99-99") ||
        (a.dueTime ?? "99:99").localeCompare(b.dueTime ?? "99:99")
      : b.updatedAt.localeCompare(a.updatedAt),
    );

  return (
    <section className="min-w-0 px-1 pb-8 pt-2 sm:px-5">
      <header className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-semibold tracking-[-0.02em] sm:text-[28px]">
            {title}
          </h1>
          <p className="mt-2 text-sm text-white/55">
            {upcoming ? "Your tasks scheduled for the days ahead" : "Your finished tasks"}
          </p>
        </div>
        {!isLoading && !isError && (
          <span className="rounded-full border border-[#6669ef]/25 bg-[#6669ef]/10 px-3 py-1 text-xs font-medium text-[#b2b3ff]">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>
        )}
      </header>

      {isLoading ? (
        <div className="rounded-2xl border border-[#383653] bg-[#191832]/90 p-5 text-sm text-white/55">
          Loading {title.toLowerCase()} tasks...
        </div>
      ) : isError ? (
        <div role="alert" className="rounded-2xl border border-rose-400/20 bg-[#21182e] p-5 text-sm text-rose-200">
          Could not load {title.toLowerCase()} tasks. Please try again.
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#4b496f] bg-[#191832]/65 px-5 py-10 text-center">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl border border-[#6669ef]/20 bg-[#6669ef]/10 text-[#a5a7ff]">
            {upcoming ? <ListTodo size={20} /> : <Check size={20} />}
          </span>
          <h2 className="mt-3 text-sm font-semibold text-[#f1f0ff]">
            {upcoming ? "Nothing upcoming" : "No completed tasks yet"}
          </h2>
          <p className="mt-1 text-xs text-[#9291b3]">
            {upcoming ? "Tasks scheduled after today will appear here." : "Tasks you complete will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task._id} task={task} className="rounded-2xl border border-[#383653] bg-[#191832]/90 p-4 transition hover:border-[#5b5884] sm:p-5" />
          ))}
        </div>
      )}
    </section>
  );
}
