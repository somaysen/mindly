"use client";

import { Check, CheckCircle2, Clock3, Lightbulb } from "lucide-react";
import { useMemo } from "react";
import { useIdeaGet } from "@/features/brain/hooks/useBrainApi";
import { useTaskCompleteGet } from "@/features/tasks/hooks/useTaskCompleteGet";
import type { Idea } from "@/types/idea";
import type { Task } from "@/types/task";

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getIdeaRecords(response: unknown, depth = 0): Idea[] {
  if (depth > 5 || !response) return [];

  if (Array.isArray(response)) {
    return response.filter(
      (item): item is Idea => Boolean(item) && typeof item === "object",
    );
  }

  if (typeof response !== "object") return [];

  const record = response as Record<string, unknown>;
  if (record._id != null || record.id != null || record.ideaId != null) {
    return [record as Idea];
  }

  for (const key of ["data", "ideas", "items", "result"]) {
    const ideas = getIdeaRecords(record[key], depth + 1);
    if (ideas.length) return ideas;
  }

  return [];
}

function getIdeaDate(idea: Idea) {
  const dateValue = idea.createdAt ?? idea.updatedAt;
  if (!dateValue) return null;

  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getCompletionDate(task: Task) {
  const completionDate =
    "completedAt" in task && typeof task.completedAt === "string"
      ? task.completedAt
      : task.updatedAt;
  const date = new Date(completionDate);
  return Number.isNaN(date.getTime()) ? null : date;
}

function WeeklyReflectionCenter() {
  const completedTasksQuery = useTaskCompleteGet();
  const ideasQuery = useIdeaGet();
  const week = useMemo(() => {
    const today = new Date();
    const start = new Date(today);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));

    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    return {
      startKey: getLocalDateKey(start),
      endKey: getLocalDateKey(end),
      label: `${start.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })} – ${new Date(end.getTime() - 1).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      })}`,
    };
  }, []);

  const completedThisWeek = useMemo(
    () =>
      (completedTasksQuery.data?.data ?? [])
        .filter((task) => {
          const date = getCompletionDate(task);
          if (!date) return false;
          const dateKey = getLocalDateKey(date);
          return dateKey >= week.startKey && dateKey < week.endKey;
        })
        .sort((first, second) => {
          return (
            (getCompletionDate(second)?.getTime() ?? 0) -
            (getCompletionDate(first)?.getTime() ?? 0)
          );
        }),
    [completedTasksQuery.data, week.endKey, week.startKey],
  );

  const ideasThisWeek = useMemo(
    () =>
      getIdeaRecords(ideasQuery.data).filter((idea) => {
        const date = getIdeaDate(idea);
        if (!date) return false;
        const dateKey = getLocalDateKey(date);
        return dateKey >= week.startKey && dateKey < week.endKey;
      }),
    [ideasQuery.data, week.endKey, week.startKey],
  );

  const bestDay = useMemo(() => {
    const counts = new Map<number, number>();
    for (const task of completedThisWeek) {
      const date = getCompletionDate(task);
      if (!date) continue;
      const weekday = date.getDay();
      counts.set(weekday, (counts.get(weekday) ?? 0) + 1);
    }

    let bestWeekday: number | null = null;
    let bestCount = 0;
    for (const [weekday, count] of counts) {
      if (count > bestCount) {
        bestWeekday = weekday;
        bestCount = count;
      }
    }

    return bestWeekday === null
      ? null
      : new Date(2024, 0, 7 + bestWeekday).toLocaleDateString(undefined, {
          weekday: "long",
        });
  }, [completedThisWeek]);

  const isLoading = completedTasksQuery.isLoading || ideasQuery.isLoading;
  const hasError = completedTasksQuery.isError || ideasQuery.isError;

  return (
    <div className="min-h-full w-full px-1 pb-8 text-white">
      <div className="flex flex-col items-start justify-between gap-3 pt-1 sm:flex-row sm:gap-5">
        <div>
          <h1 className="text-[22px] font-bold leading-none">
            Weekly Reflection
          </h1>

          <p className="mt-4 text-[12px] text-gray-300">
            Take a few minutes to pause before moving into a new week.
          </p>

          <p className="mt-2 text-[11px] text-[#8d8cff]">
            {isLoading
              ? "Loading your weekly activity..."
              : ideasQuery.isError
                ? "Thought activity is unavailable."
                : `${ideasThisWeek.length} ${
                    ideasThisWeek.length === 1 ? "thought" : "thoughts"
                  } captured this week`}
          </p>
        </div>

        <span className="rounded-full bg-[#d9d7ff] px-3 py-1 text-[9px] font-medium text-[#292650]">
          {week.label}
        </span>
      </div>

      <section className="mt-8">
        <h2 className="text-[17px] font-medium">Weekly Summary</h2>

        {hasError && (
          <p role="alert" className="mt-3 text-xs text-red-300">
            Could not load some weekly activity. Please try again later.
          </p>
        )}

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="relative min-h-[126px] overflow-hidden rounded-2xl border border-[#45436d] bg-gradient-to-r from-[#202047] via-[#343276] to-[#1e1c42]">
            <div className="absolute -left-10 -top-16 h-40 w-56 rounded-full bg-[#716eff] opacity-50 blur-3xl" />

            <div className="relative z-10 flex h-full items-center justify-between px-4">
              <div className="self-start pt-5">
                <Check size={25} strokeWidth={3} className="text-[#7775ff]" />

                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[38px] font-semibold leading-none">
                    {completedTasksQuery.isLoading ||
                    completedTasksQuery.isError
                      ? "—"
                      : completedThisWeek.length}
                  </span>

                  <span className="text-[13px] leading-4 text-white">
                    Tasks
                    <br />
                    completed
                  </span>
                </div>

                <span className="mt-2 inline-block rounded-full bg-[#7472a8] px-2 py-0.5 text-[7px]">
                  Best day: {bestDay ?? "—"}
                </span>
              </div>

              <div
                aria-hidden="true"
                className="flex h-full w-[40%] items-end justify-center sm:w-[45%]"
              >
                <div className="relative mb-[-8px] h-[100px] w-[115px] rotate-6 border-2 border-[#8583ff] bg-[#e7e7ff] shadow-[0_0_30px_rgba(113,110,255,0.6)]">
                  <div className="absolute left-4 top-4 space-y-3">
                    <div className="h-1 w-12 rounded bg-[#4e4a91]" />
                    <div className="h-1 w-16 rounded bg-[#4e4a91]" />
                    <div className="h-1 w-10 rounded bg-[#4e4a91]" />
                    <div className="h-1 w-14 rounded bg-[#4e4a91]" />
                  </div>

                  <div className="absolute right-2 top-5 h-3 w-3 rounded-full bg-[#5957db]" />
                  <div className="absolute right-6 top-12 h-3 w-3 rounded-full bg-[#5957db]" />
                  <div className="absolute right-3 top-[70px] h-3 w-3 rounded-full bg-[#5957db]" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative min-h-[126px] rounded-2xl bg-[#a9e6ce] p-4 text-[#29483f]">
            <div className="flex items-start justify-between">
              <Clock3 size={21} className="text-[#57947e]" />
              <span className="rounded-full bg-[#82cdb3] px-2 py-1 text-[7px] text-white">
                Not tracked
              </span>
            </div>

            <div className="mt-2">
              <h3 className="text-[30px] font-semibold leading-none">—</h3>
              <p className="mt-2 text-[13px]">Focus time</p>
              <p className="mt-1 text-[10px]">
                Focus sessions aren&apos;t recorded yet.
              </p>
            </div>
          </div>

          <div className="relative min-h-[126px] rounded-2xl bg-[#7271e6] p-4 text-[#22234d]">
            <div className="flex items-start justify-between">
              <Lightbulb size={22} className="text-[#d0d0ff]" strokeWidth={2} />
              <span className="rounded-full bg-[#9898ef] px-2 py-1 text-[7px] text-white">
                This week
              </span>
            </div>

            <div className="mt-2">
              <h3 className="text-[31px] font-semibold leading-none">
                {ideasQuery.isLoading || ideasQuery.isError
                  ? "—"
                  : ideasThisWeek.length}
              </h3>
              <p className="mt-2 text-[13px]">Thoughts captured</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-[17px] font-medium">Small Wins</h2>
          <p className="text-[11px] text-gray-300">
            Celebrate the progress you made, no matter how small.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {completedTasksQuery.isLoading ? (
            <p className="text-xs text-[#b8b7d7]">
              Loading this week&apos;s completed tasks...
            </p>
          ) : completedTasksQuery.isError ? (
            <p role="alert" className="text-xs text-red-300">
              Could not load this week&apos;s completed tasks.
            </p>
          ) : completedThisWeek.length > 0 ? (
            completedThisWeek.slice(0, 3).map((task) => (
              <div
                key={task._id}
                className="rounded-xl border border-[#2f2e52] bg-[#1b1a38] px-3 py-3"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle2
                    size={15}
                    fill="white"
                    className="shrink-0 text-[#30304e]"
                  />
                  <div>
                    <p className="text-[12px] font-medium">
                      {task.taskName || "Completed task"}
                    </p>
                    <p className="mt-1 text-[10px] text-[#b8b7d7]">
                      {task.description || "Completed this week"}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#b8b7d7]">
              No completed tasks this week yet. Your wins will appear here.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default WeeklyReflectionCenter;
