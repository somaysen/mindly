"use client";

import {
  ChevronUp,
  ChevronDown,
  PenLine,
  Users,
} from "lucide-react";

const schedules = [
//   {
//     time: "09:00",
//     title: "Design Class",
//     subtitle: "Typography Workshop",
//     duration: "9:00 - 10:30",
//     type: "design",
//   },
//   {
//     time: "10:30",
//     title: "Team Stand-up",
//     subtitle: "Mindly Project sync",
//     duration: "10:30 - 11:30",
//     type: "team",
//   },
//   {
//     time: "13:00",
//     title: "Portfolio Review",
//     subtitle: "Review case study with mentor",
//     duration: "13:00 - 13:30",
//     type: "design",
//   },
];

export default function TaskSchedule() {
  return (
    <div className="w-full max-w-[440px] rounded-[28px] border border-[#555477] bg-[#191936] px-5 py-5 text-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-[29px] font-medium tracking-[-0.8px]">
          Today’s Schedule
        </h2>

        <ChevronUp
          size={31}
          strokeWidth={2.5}
          className="text-white"
        />
      </div>

      {/* Table Header */}
      <div className="mt-8 grid grid-cols-[70px_1fr] items-center">
        <span className="text-[16px] font-medium">Time</span>

        <div className="flex items-center justify-between">
          <span className="text-[16px] font-medium">
            Today’s Timeline
          </span>

          <button className="flex items-center gap-1 rounded-full bg-[#5755dc] px-3 py-1 text-[12px] font-medium">
            All
            <ChevronDown size={13} />
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative mt-7">
        {/* Vertical timeline line */}
        <div className="absolute left-[39px] top-4 bottom-8 w-px bg-[#4a4968]" />

        <div className="space-y-7">
          {schedules.map((item, index) => (
            <div
              key={item.time}
              className="relative grid grid-cols-[70px_1fr] gap-0"
            >
              {/* Time */}
              <div className="relative z-10">
                <span className="text-[13px] font-medium text-white">
                  {item.time}
                </span>

                {/* Current time indicator */}
                {index === 1 && (
                  <div className="absolute left-[-5px] top-[18px] flex items-center">
                    <span className="rounded-full bg-[#5856e8] px-2 py-[2px] text-[12px] font-medium text-white">
                      10:50
                    </span>
                  </div>
                )}
              </div>

              {/* Schedule Card */}
              <div
                className="
                  relative
                  min-h-[102px]
                  rounded-[20px]
                  border
                  border-[#595875]
                  bg-[#222248]
                  px-3
                  py-3
                "
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div
                    className={`flex h-[29px] w-[29px] shrink-0 items-center justify-center rounded-full ${
                      item.type === "team"
                        ? "bg-[#a8e5ce]"
                        : "bg-[#ffb52d]"
                    }`}
                  >
                    {item.type === "team" ? (
                      <Users
                        size={18}
                        strokeWidth={2.3}
                        className="text-[#28594e]"
                      />
                    ) : (
                      <PenLine
                        size={17}
                        strokeWidth={2.5}
                        className="text-[#654500]"
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-medium leading-5">
                      {item.title}
                    </h3>

                    <p className="mt-[2px] text-[12px] text-white">
                      {item.subtitle}
                    </p>

                    <p className="mt-4 text-[13px] text-[#aaa9d8]">
                      {item.duration}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Current time horizontal line */}
        <div className="pointer-events-none absolute left-[20px] right-[-5px] top-[166px] flex items-center">
          <div className="h-px flex-1 border-t border-dashed border-[#7775e8]" />

          <div className="ml-[-2px] h-[6px] w-[6px] rounded-full bg-[#8987ed]" />
        </div>
      </div>
    </div>
  );
}