"use client";

import { useMemo } from "react";
import { CalendarDays, Check, Clock3, ListTodo } from "lucide-react";

import { useTaskGet } from "@/features/tasks/hooks/useTesk";
import type { Task } from "@/types/task";

const pad = (value: number) => String(value).padStart(2, "0");

function getLocalDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatTime(value: string | null) {
  if (!value) return "Any time";
  const [hourText, minuteText = "00"] = value.split(":");
  const hour = Number(hourText);
  if (Number.isNaN(hour)) return value;
  return `${hour % 12 || 12}:${minuteText.slice(0, 2)} ${hour >= 12 ? "pm" : "am"}`;
}

function DashbordToday() {
  const { data, isLoading, isError } = useTaskGet();
  const tasks = useMemo(() => {
    const allTasks: Task[] = Array.isArray(data?.data) ? data.data : [];
    const today = getLocalDateKey(new Date());

    return allTasks
      .filter((task) => task.dueDate?.slice(0, 10) === today)
      .sort((first, second) => (first.dueTime ?? "99:99").localeCompare(second.dueTime ?? "99:99"));
  }, [data]);

  const completedCount = tasks.filter((task) => task.status === "completed").length;
  const openCount = tasks.length - completedCount;

  return (
    <section className="min-w-0 px-1 pb-8 pt-2 sm:px-5">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-semibold tracking-[-0.02em] sm:text-[28px]">
            Today
          </h1>
          <p className="mt-2 text-sm text-white/55">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        {!isLoading && !isError && (
          <p className="text-sm text-white/55">
            <span className="font-medium text-white">{openCount}</span> left
            {completedCount > 0 && <> · {completedCount} completed</>}
          </p>
        )}
      </header>

      {isLoading ? (
        <div className="rounded-2xl border border-[#383653] bg-[#191832]/90 p-5 text-sm text-white/55">
          Loading today&apos;s tasks...
        </div>
      ) : isError ? (
        <div role="alert" className="rounded-2xl border border-rose-400/20 bg-[#21182e] p-5 text-sm text-rose-200">
          Could not load today&apos;s tasks. Please try again.
        </div>
      ) : tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#4b496f] bg-[#191832]/65 px-5 py-10 text-center">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-2xl border border-[#6669ef]/20 bg-[#6669ef]/10 text-[#a5a7ff]">
            <ListTodo size={20} />
          </span>
          <h2 className="mt-3 text-sm font-semibold text-[#f1f0ff]">Nothing due today</h2>
          <p className="mt-1 text-xs text-[#9291b3]">Tasks scheduled for today will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <article key={task._id} className="rounded-2xl border border-[#383653] bg-[#191832]/90 p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span
                  aria-label={task.status === "completed" ? "Completed" : "Not completed"}
                  className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${
                    task.status === "completed"
                      ? "border-[#7779f2] bg-[#6669ef] text-white"
                      : "border-[#5a587e] text-transparent"
                  }`}
                >
                  {task.status === "completed" && <Check size={13} strokeWidth={2.5} />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className={`min-w-0 flex-1 text-sm font-medium ${task.status === "completed" ? "text-[#aaa8c7] line-through" : "text-[#f1f0ff]"}`}>
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
                      <CalendarDays size={13} className="text-[#8587ef]" /> Today
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

export default DashbordToday;
