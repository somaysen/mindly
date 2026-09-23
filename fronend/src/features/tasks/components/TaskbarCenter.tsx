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
        flex-1
        h-screen
        overflow-y-auto
        overflow-x-hidden
        text-white
        px-6
        pb-6
        pt-15
      "
    >
      <div className="mx-auto w-full max-w-[1400px]">
        <div
          className="
            grid
            w-full
            grid-cols-1
            gap-6
            xl:grid-cols-[minmax(0,1fr)_285px]
          "
        >
          {/* ================= LEFT ================= */}
          <section className="min-w-0 pt-">
            {/* HERO */}
            <div className="relative flex h-[190px] w-full items-start justify-between overflow-hidden">
              <div className="relative z-20">
                <h1 className="text-[25px] font-semibold">
                  Nothing planned yet
                </h1>

                <p className="mt-2 max-w-[230px] text-[12px] leading-5 text-[#A6A6BD]">
                  Create your first task and start building
                  <br />
                  momentum.
                </p>
              </div>

              <img
                src="/images/girl laptop 02 1.png"
                alt="Girl working on laptop"
                className="
                  pointer-events-none
                  absolute
                  right-0
                  top-1/2
                  w-[250px]
                  -translate-x-1/2
                  -translate-y-1/2
                  object-contain
                "
              />
            </div>

            {/* SEARCH */}
            <div className="flex items-center justify-between pt-5 ">
              <div
                className="
                  flex
                  h-11
                  w-full
                  max-w-[400px]
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#30304D]
                  bg-[#18172F]
                  px-3
                "
              >
                <Search size={18} className="text-[#A9AAC8]" />

                <input
                  type="text"
                  placeholder="Search tasks, projects or notes..."
                  className="
                    w-full
                    bg-transparent
                    text-[12px]
                    text-white
                    outline-none
                    placeholder:text-[#8D8DA8]
                  "
                />
              </div>

              <div className="flex items-center justify-between gap-3 " >
                <button className="flex h-11 w-11 items-center justify-center rounded-full border border-[#30304D] bg-[#18172F] text-[#A9AAC8]">
                  <SlidersHorizontal size={16} />
                </button>
 
                <button className="flex h-11   w-11  items-center justify-center rounded-full border border-[#30304D] bg-[#18172F] text-[#A9AAC8]">
                  <ArrowDownUp size={16} />
                </button>
              </div>
            </div>

            {/* TODAY'S FOCUS */}
            <section className="mt-7">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-[20px] font-medium">Today’s Focus</h2>

                <button className="text-[15px] text-[#6468F2]">Show all</button>
              </div>

              <div
                className="
                  flex
                  min-h-[145px]
                  w-full
                  flex-col
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-[#252442]
                  bg-[#191832]
                "
              >
                <FilePenLine size={25} className="mb-2 text-[#B5B5C9]" />

                <p className="text-[15px] text-[#B5B5C9]">No tasks yet.</p>

                <button
                  className="
                    mt-5
                    flex
                    items-center
                    gap-1
                    rounded-full
                    bg-[#5559ED]
                    px-4
                    py-1.5
                    text-[15px]
                    font-medium
                  "
                >
                  <Plus size={18} />
                  Add task
                </button>
              </div>
            </section>
          </section>

          {/* ================= RIGHT ================= */}
          <aside className="flex w-full flex-col gap-4 xl:w-[285px]">
            <div className="overflow-hidden rounded-xl border border-[#30304D] bg-[#191832]">
              <Calendar />
            </div>

            <div className="overflow-hidden rounded-xl border border-[#30304D] bg-[#191832]">
              <TaskSchedule />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default TaskbarCenter;
