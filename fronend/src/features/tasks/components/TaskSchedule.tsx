"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, PenLine } from "lucide-react";

import { useScheduleGet } from "@/features/tasks/hooks/useSchedule";

const getCurrentTime = () => {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
};

export default function TaskSchedule() {
  const { data, isLoading, isError } = useScheduleGet();
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const hasValidScheduleData = Array.isArray(data?.data?.tasks);
  const schedules = hasValidScheduleData
    ? [...data.data.tasks].sort((first, second) =>
        (first.dueTime ?? "99:99").localeCompare(second.dueTime ?? "99:99"),
      )
    : [];
  const lastCurrentScheduleIndex = currentTime
    ? schedules.findLastIndex(
        (task) => task.dueTime && task.dueTime <= currentTime,
      )
    : -1;
  const currentTimeIndex =
    schedules.some((task) => task.dueTime) && lastCurrentScheduleIndex === -1
      ? 0
      : lastCurrentScheduleIndex;

  useEffect(() => {
    setCurrentTime(getCurrentTime());
    const intervalId = window.setInterval(
      () => setCurrentTime(getCurrentTime()),
      60_000,
    );

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <section className="w-full rounded-[28px] border border-[#555477] bg-[#191936] px-4 py-5 text-white shadow-xl sm:px-5">
      <header className="flex items-center justify-between gap-2">
        <h2 className="text-[clamp(1.125rem,2vw,1.5rem)] font-medium tracking-[-0.8px]">
          Today’s Schedule
        </h2>
        <button
          type="button"
          aria-label="Collapse schedule"
          className="shrink-0 text-white"
        >
          <ChevronUp size={28} strokeWidth={2.5} />
        </button>
      </header>

      <div className="mt-7 grid grid-cols-[52px_minmax(0,1fr)] items-center gap-2">
        <span className="text-sm font-medium">Time</span>
        <div className="flex min-w-0 items-center justify-between gap-2">
          <span className="truncate text-sm font-medium">
            Today’s Timeline
          </span>
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 rounded-full bg-[#5755dc] px-2.5 py-1 text-xs font-medium"
          >
            All
            <ChevronDown size={13} />
          </button>
        </div>
      </div>

      <div className="relative mt-6">
        {!isLoading && !isError && hasValidScheduleData && schedules.length > 0 && (
          <div
            aria-hidden="true"
            className="absolute bottom-4 left-[25px] top-3 w-px bg-[#4a4968]"
          />
        )}

        <div className="space-y-6">
          {isLoading ? (
            <p className="pl-[60px] text-sm text-white/55">
              Loading today&apos;s schedule...
            </p>
          ) : isError ? (
            <p role="alert" className="pl-[60px] text-sm text-rose-200">
              Could not load today&apos;s schedule.
            </p>
          ) : !hasValidScheduleData ? (
            <p role="alert" className="pl-[60px] text-sm text-rose-200">
              Today&apos;s schedule response is invalid.
            </p>
          ) : schedules.length === 0 ? (
            <p className="pl-[60px] text-sm text-white/55">
              No tasks scheduled for today.
            </p>
          ) : (
            schedules.map((item, index) => (
              <div
                key={item._id}
                className="relative grid grid-cols-[52px_minmax(0,1fr)] gap-2"
              >
                <div className="relative z-10 pt-1">
                  <span className="text-xs font-medium text-white">
                    {item.dueTime ?? "—"}
                  </span>
                </div>

                <article className="relative min-h-[96px] min-w-0 rounded-[20px] border border-[#595875] bg-[#222248] px-3 py-3">
                  <div className="flex items-start gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ffb52d]">
                      <PenLine
                        size={16}
                        strokeWidth={2.5}
                        className="text-[#654500]"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-[15px] font-medium leading-5">
                        {item.taskName}
                      </h3>
                      <p className="mt-0.5 line-clamp-2 text-xs leading-4 text-white">
                        {item.description || "No description"}
                      </p>
                      <p className="mt-3 text-xs text-[#b8b8e4]">
                        {item.dueTime
                          ? `Scheduled for ${item.dueTime}`
                          : "No time set"}
                      </p>
                    </div>
                  </div>
                </article>

                {currentTime && index === currentTimeIndex && (
                  <div
                    aria-label={`Current time ${currentTime}`}
                    className="pointer-events-none absolute -left-1 right-[-4px] top-[34px] z-20 flex items-center"
                  >
                    <span className="rounded-full bg-[#5856e8] px-1.5 py-1 text-[11px] font-medium leading-none text-white">
                      {currentTime}
                    </span>
                    <div className="h-px flex-1 border-t border-dashed border-[#8987ed]" />
                    <span className="ml-[-1px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#8987ed]" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
