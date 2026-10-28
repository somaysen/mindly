"use client";

import { useMemo } from "react";
import { ListTodo } from "lucide-react";

import { useTaskGet } from "@/features/tasks/hooks/useTesk";
import TaskCard from "@/features/tasks/components/TaskCard";
import type { Task } from "@/types/task";

const pad = (value: number) => String(value).padStart(2, "0");

function getLocalDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
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
            <TaskCard key={task._id} task={task} className="rounded-2xl border border-[#383653] bg-[#191832]/90 p-4 transition hover:border-[#5b5884] sm:p-5" />
          ))}
        </div>
      )}
    </section>
  );
}

export default DashbordToday;
