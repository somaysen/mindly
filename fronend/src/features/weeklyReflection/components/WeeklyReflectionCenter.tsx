"use client";

import React from "react";
import {
  Check,
  Clock3,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

function WeeklyReflectionCenter() {
  return (
    <div className="min-h-screen w-full px-1 pb-8 text-white">
      {/* Header */}
      <div className="flex items-start justify-between pt-1">
        <div>
          <h1 className="text-[22px] font-bold leading-none">
            Weekly Reflection
          </h1>

          <p className="mt-4 text-[12px] text-gray-300">
            Take a few minutes to pause before moving into a new week.
          </p>

          <p className="mt-2 text-[11px] text-[#8d8cff]">
            • 5 thoughts waiting to be processed
          </p>
        </div>

        <span className="rounded-full bg-[#d9d7ff] px-3 py-1 text-[9px] font-medium text-[#292650]">
          Week 24
        </span>
      </div>

      {/* Weekly Summary */}
      <section className="mt-8">
        <h2 className="text-[17px] font-medium">Weekly Summary</h2>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Tasks Completed */}
          <div className="relative h-[126px] overflow-hidden rounded-2xl border border-[#45436d] bg-gradient-to-r from-[#202047] via-[#343276] to-[#1e1c42]">
            {/* Glow */}
            <div className="absolute -left-10 -top-16 h-40 w-56 rounded-full bg-[#716eff] opacity-50 blur-3xl" />

            <div className="relative z-10 flex h-full items-center justify-between px-4">
              <div className="self-start pt-5">
                <Check
                  size={25}
                  strokeWidth={3}
                  className="text-[#7775ff]"
                />

                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[38px] font-semibold leading-none">
                    18
                  </span>

                  <span className="text-[13px] leading-4 text-white">
                    Tasks
                    <br />
                    completed
                  </span>
                </div>

                <span className="mt-2 inline-block rounded-full bg-[#7472a8] px-2 py-0.5 text-[7px]">
                  Best day: Wednesday
                </span>
              </div>

              {/* Illustration placeholder */}
              <div className="flex h-full w-[45%] items-end justify-center">
                <div className="relative mb-[-8px] h-[100px] w-[115px] rotate-6 border-2 border-[#8583ff] bg-[#e7e7ff] shadow-[0_0_30px_rgba(113,110,255,0.6)]">
                  <div className="absolute left-4 top-4 space-y-3">
                    <div className="h-1 w-12 rounded bg-[#4e4a91]" />
                    <div className="h-1 w-16 rounded bg-[#4e4a91]" />
                    <div className="h-1 w-10 rounded bg-[#4e4a91]" />
                    <div className="h-1 w-14 rounded bg-[#4e4a91]" />
                  </div>

                  <div className="absolute right-2 top-5 flex h-3 w-3 items-center justify-center rounded-full bg-[#5957db]" />
                  <div className="absolute right-6 top-12 flex h-3 w-3 items-center justify-center rounded-full bg-[#5957db]" />
                  <div className="absolute right-3 top-[70px] flex h-3 w-3 items-center justify-center rounded-full bg-[#5957db]" />
                </div>
              </div>
            </div>
          </div>

          {/* Focus Time */}
          <div className="relative h-[126px] rounded-2xl bg-[#a9e6ce] p-4 text-[#29483f]">
            <div className="flex items-start justify-between">
              <Clock3 size={21} className="text-[#57947e]" />

              <span className="rounded-full bg-[#82cdb3] px-2 py-1 text-[7px] text-white">
                Longest session: 2h 08m
              </span>
            </div>

            <div className="mt-2">
              <h3 className="text-[30px] font-semibold leading-none">
                11h 14m
              </h3>

              <p className="mt-2 text-[13px]">Focus Time</p>
            </div>
          </div>

          {/* Thoughts Captured */}
          <div className="relative h-[126px] rounded-2xl bg-[#7271e6] p-4 text-[#22234d]">
            <div className="flex items-start justify-between">
              <Lightbulb
                size={22}
                className="text-[#d0d0ff]"
                strokeWidth={2}
              />

              <span className="rounded-full bg-[#9898ef] px-2 py-1 text-[7px] text-white">
                29 organized
              </span>
            </div>

            <div className="mt-2">
              <h3 className="text-[31px] font-semibold leading-none">37</h3>

              <p className="mt-2 text-[13px]">Thoughts captured</p>
            </div>
          </div>
        </div>
      </section>

      {/* Small Wins */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-[17px] font-medium">Small Wins</h2>

          <p className="text-[11px] text-gray-300">
            Celebrate the progress you made, no matter how small.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 lg:grid-cols-3">
          {/* Win 1 */}
          <div className="rounded-xl border border-[#2f2e52] bg-[#1b1a38] px-3 py-3">
            <div className="flex items-start gap-2">
              <CheckCircle2
                size={15}
                fill="white"
                className="shrink-0 text-[#30304e]"
              />

              <div>
                <p className="text-[12px] font-medium">
                  Finished dashboard redesign
                </p>

                <p className="mt-1 text-[10px] text-[#b8b7d7]">
                  Completed the core screens for Mindly
                </p>
              </div>
            </div>
          </div>

          {/* Win 2 */}
          <div className="rounded-xl border border-[#2f2e52] bg-[#1b1a38] px-3 py-3">
            <div className="flex items-start gap-2">
              <CheckCircle2
                size={15}
                fill="white"
                className="shrink-0 text-[#30304e]"
              />

              <div>
                <p className="text-[12px] font-medium">
                  Organized your Brain Dump
                </p>

                <p className="mt-1 text-[10px] text-[#b8b7d7]">
                  29 thoughts turned into actionable items
                </p>
              </div>
            </div>
          </div>

          {/* Win 3 */}
          <div className="rounded-xl border border-[#2f2e52] bg-[#1b1a38] px-3 py-3">
            <div className="flex items-start gap-2">
              <CheckCircle2
                size={15}
                fill="white"
                className="shrink-0 text-[#30304e]"
              />

              <div>
                <p className="text-[12px] font-medium">
                  Stayed consistent with focus sessions
                </p>

                <p className="mt-1 text-[10px] text-[#b8b7d7]">
                  Completed 9 deep work sessions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WeeklyReflectionCenter;