"use client";

import React from "react";
import Topbar from "@/features/dashboard/components/Topbar";
import {
  Lightbulb,
  Mic,
  Paperclip,
  ChevronUp,
  Sparkles,
  CheckSquare,
} from "lucide-react";

function BrainCenter() {
  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-[#0c0b1d]">

      {/* ================= TOPBAR ================= */}
      <header className="h-[82px]  w-full shrink-0">
        <div className="mx-auto h-full w-full max-w-[1600px] px-3">
          <Topbar />
        </div>
      </header>

      {/* ================= SCROLLABLE CONTENT ================= */}
      <main className="min-h-0 flex-1 relative top-15  overflow-y-auto scrollbar-none">
        <div className="mx-auto w-full max-w-[1600px] px-3 pb-10">

          {/* ================= HERO ================= */}
          <section className="pt-6">
            <h1 className="text-3xl font-semibold text-white">
              Brain Dump
            </h1>

            <p className="mt-2 text-sm text-gray-300">
              Clear your mind. We'll organize the rest.
            </p>

            <p className="mt-1 text-xs text-[#8885e8]">
              • 5 thoughts waiting to be processed
            </p>
          </section>

          {/* ================= BRAIN DUMP BOX ================= */}
          <section
            className="
              relative
              mt-8
              min-h-[190px]
              w-full
              rounded-xl
              border border-[#34345b]
              bg-[#191936]
              p-4
            "
          >
            {/* Heading */}
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Lightbulb size={15} />
              <span>What's on your mind?</span>
            </div>

            {/* Collapse */}
            <ChevronUp
              size={18}
              className="absolute right-4 top-4 text-gray-400"
            />

            {/* Placeholder */}
            <p className="mt-2 text-sm text-gray-500">
              e.g. Finish the landing page copy...
            </p>

            {/* Bottom controls */}
            <div className="absolute bottom-5 left-5 flex items-center gap-5">
              <Mic
                size={17}
                className="cursor-pointer text-gray-500 hover:text-white"
              />

              <Paperclip
                size={17}
                className="cursor-pointer text-gray-500 hover:text-white"
              />
            </div>

            {/* Organise */}
            <button
              className="
                absolute
                bottom-5
                right-5
                flex
                items-center
                gap-2
                rounded-full
                bg-gradient-to-r
                from-[#8585ed]
                to-[#5e5be5]
                px-5
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:opacity-90
              "
            >
              <Sparkles size={15} />
              Organise
            </button>
          </section>

          {/* ================= TODAY'S FOCUS ================= */}
          <section className="mt-8">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Today's Focus
              </h2>

              <button className="text-sm text-[#7774ed] hover:text-[#9896ff]">
                Show all
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_270px]">

              {/* Focus Card */}
              <div
                className="
                  min-h-[150px]
                  rounded-xl
                  border
                  border-[#34345b]
                  bg-[#191936]
                  p-5
                "
              >
                {/* Pinned */}
                <div className="mb-4 flex items-center gap-2 text-xs text-[#8885e8]">
                  <span>✦</span>
                  <span>Pinned</span>
                </div>

                {/* Task */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex h-4 w-4
                        items-center justify-center
                        rounded
                        border border-gray-300
                      "
                    >
                      <CheckSquare
                        size={11}
                        className="text-transparent"
                      />
                    </div>

                    <span className="text-sm font-medium text-white">
                      Finalize case study presentation
                    </span>
                  </div>

                  <span
                    className="
                      rounded-full
                      bg-[#ffd5d8]
                      px-2.5
                      py-1
                      text-[10px]
                      font-medium
                      text-[#8e4b55]
                    "
                  >
                    High
                  </span>
                </div>

                {/* Meta */}
                <div className="mt-5 flex items-center gap-3 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                    Design Class
                  </span>

                  <span>Today • 6:00pm</span>
                </div>
              </div>

              {/* Tip */}
              <div
                className="
                  h-fit
                  rounded-xl
                  border
                  border-[#45456e]
                  bg-[#242448]
                  p-4
                "
              >
                <h3 className="text-base font-semibold text-white">
                  Tip
                </h3>

                <p className="mt-1 text-sm leading-5 text-gray-200">
                  Use AI to instantly separate tasks and reminders.
                </p>
              </div>
            </div>
          </section>

          {/* ================= EXTRA CONTENT ================= */}
          <div className="mt-6 space-y-4">
            {[1].map((item) => (
              <div
                key={item}
                className="
                  h-32
                  rounded-xl
                  border
                  border-[#34345b]
                  bg-[#15152f]
                  p-5
                  text-gray-400
                "
              >
                Additional brain dump content {item}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default BrainCenter;