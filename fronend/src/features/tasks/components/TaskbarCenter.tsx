"use client";

import React from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowDownUp,
  Plus,
  FilePenLine,
} from "lucide-react";

import Calendar from "@/components/Calendar";
import TaskSchedule from "./TaskSchedule";

function TaskbarCenter() {
  return (
    <main
      className="
    min-h-screen
    w-full
    overflow-x-hidden
    bg-[#0c0b19]
    px-5
    pb-8
    pt-2
    text-white
    lg:ml-[205px]
    lg:w-[calc(100%-205px)]
    lg:px-6
  "
    >
      <div className="w-full">
        {/* ================= MAIN GRID ================= */}
        <div
          className="
    grid
    w-full
    grid-cols-1
    gap-6
    lg:grid-cols-[minmax(0,1fr)_250px]
    xl:grid-cols-[minmax(0,1fr)_270px]
  "
        >
          {/* ================= LEFT ================= */}
          <section className="max-w-[1300px]">
            {/* ================= HERO ================= */}
            <div className="relative flex h-[235px] w-full items-center">
              <div className="relative z-10">
                <h1 className="text-[25px] font-semibold">
                  Nothing planned yet
                </h1>

                <p className="mt-2 text-sm leading-5 text-gray-300">
                  Create your first task and start building
                  <br />
                  momentum.
                </p>
              </div>

              {/* Illustration */}
              <img
                src="/images/girl laptop 02 1.png"
                alt="Girl working on laptop"
                className="
                  pointer-events-none
                  absolute
                  bottom-1
                  left-[58%]
                  w-[190px]
                  -translate-x-1/2
                  object-contain

                  xl:w-[210px]
                "
              />
            </div>

            {/* ================= SEARCH ================= */}
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-full
                  max-w-[290px]
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#343256]
                  bg-[#191832]
                  px-3
                "
              >
                <Search size={17} className="shrink-0 text-[#b5b6dc]" />

                <input
                  type="text"
                  placeholder="Search tasks, projects or notes..."
                  className="
                    w-full
                    bg-transparent
                    text-xs
                    text-white
                    outline-none
                    placeholder:text-[#aaaaca]
                  "
                />
              </div>

              <button
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#343256]
                  bg-[#1b1a42]
                  text-[#c6c8ff]
                  hover:bg-[#27265b]
                "
              >
                <SlidersHorizontal size={17} />
              </button>

              <button
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#343256]
                  bg-[#1b1a42]
                  text-[#c6c8ff]
                  hover:bg-[#27265b]
                "
              >
                <ArrowDownUp size={17} />
              </button>
            </div>

            {/* ================= TODAY'S FOCUS ================= */}
            <section className="mt-8">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[19px] font-medium">Today’s Focus</h2>

                <button className="text-sm text-[#666ff1] hover:text-[#858bff]">
                  Show all
                </button>
              </div>

              <div
                className="
                  flex
                  min-h-[185px]
                  w-full
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-[#252442]
                  bg-[#1b1a3b]
                "
              >
                <FilePenLine
                  size={26}
                  strokeWidth={1.5}
                  className="mb-3 text-gray-300"
                />

                <p className="text-sm text-gray-300">No tasks yet.</p>

                <button
                  className="
                    mt-4
                    flex
                    items-center
                    gap-2
                    rounded-full
                    bg-[#5559ed]
                    px-5
                    py-2
                    text-sm
                    font-medium
                    shadow-[0_5px_20px_rgba(80,80,230,0.25)]
                    hover:bg-[#6569f5]
                  "
                >
                  <Plus size={17} />
                  Add task
                </button>
              </div>
            </section>
          </section>

          {/* ================= RIGHT ================= */}
          <aside className="flex min-w-0 flex-col gap-5">
            <Calendar />

            <TaskSchedule />
          </aside>
        </div>
      </div>
    </main>
  );
}

export default TaskbarCenter;
