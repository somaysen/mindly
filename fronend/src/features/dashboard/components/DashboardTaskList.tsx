"use client";

import { useMemo } from "react";
import { CalendarDays, Check, Clock3, ListTodo } from "lucide-react";

import { useTaskGet } from "@/features/tasks/hooks/useTesk";
import type { Task } from "@/types/task";

type TaskListMode = "upcoming" | "completed";

const pad = (value: number) => String(value).padStart(2, "0");

function getLocalDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDate(value: string | null) {
  if (!value) return "No due date";
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: year === new Date().getFullYear() ? undefined : "numeric",
  });
}

function formatTime(value: string | null) {
  if (!value) return "Any time";
  const [hourText, minuteText = "00"] = value.split(":");
  const hour = Number(hourText);
  if (Number.isNaN(hour)) return value;
  return `${hour % 12 || 12}:${minuteText.slice(0, 2)} ${hour >= 12 ? "pm" : "am"}`;
}

export default function DashboardTaskList({ mode }: { mode: TaskListMode }) {
  const { data, isLoading, isError } = useTaskGet();
  const tasks = useMemo(() => {
    const allTasks: Task[] = Array.isArray(data?.data) ? data.data : [];
    const today = getLocalDateKey(new Date());
    const selectedTasks = mode === "completed"
      ? allTasks.filter((task) => task.status === "completed")
      : allTasks.filter((task) =>
          task.status !== "completed" && Boolean(task.dueDate) && task.dueDate!.slice(0, 10) > today,
        );

    return selectedTasks.sort((first, second) => {
      if (mode === "completed") return second.updatedAt.localeCompare(first.updatedAt);
      const dateOrder = (first.dueDate ?? "9999-99-99").localeCompare(second.dueDate ?? "9999-99-99");
      return dateOrder || (first.dueTime ?? "99:99").localeCompare(second.dueTime ?? "99:99");
    });
  }, [data, mode]);

  const title = mode === "upcoming" ? "Upcoming" : "Completed";
  const emptyTitle = mode === "upcoming" ? "Nothing upcoming" : "No completed tasks yet";
  const emptyDescription = mode === "upcoming"
    ? "Tasks scheduled after today will appear here."
    : "Tasks you complete will appear here.";

  return (
    <section className="min-w-0 px-1 pb-8 pt-2 sm:px-5">
      <header className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-semibold tracking-[-0.02em] sm:text-[28px]">
            {title}
          </h1>
          <p className="mt-2 text-sm text-white/55">
            {mode === "upcoming" ? "Your tasks scheduled for the days ahead" : "Your finished tasks"}
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
            {mode === "completed" ? <Check size={20} /> : <ListTodo size={20} />}
          </span>
          <h2 className="mt-3 text-sm font-semibold text-[#f1f0ff]">{emptyTitle}</h2>
          <p className="mt-1 text-xs text-[#9291b3]">{emptyDescription}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <article key={task._id} className="rounded-2xl border border-[#383653] bg-[#191832]/90 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${mode === "completed" ? "border-[#7779f2] bg-[#6669ef] text-white" : "border-[#5a587e] text-transparent"}`}>
                  {mode === "completed" && <Check size={13} strokeWidth={2.5} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className={`min-w-0 flex-1 text-sm font-medium ${mode === "completed" ? "text-[#aaa8c7] line-through" : "text-[#f1f0ff]"}`}>
                      {task.taskName || "Untitled task"}
                    </h2>
                    <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.08em] text-white/55">
                      {task.status.replace("-", " ")}
                    </span>
                  </div>
                  {task.description && (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[#a3a1bd]">{task.description}</p>
                  )}
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-[#9291b3]">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={13} className="text-[#8587ef]" /> {formatDate(task.dueDate)}
                    </span>
                    {task.dueTime && (
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 size={13} className="text-[#8587ef]" /> {formatTime(task.dueTime)}
                      </span>
                    )}
                    <span className="capitalize">{task.priority} priority</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
