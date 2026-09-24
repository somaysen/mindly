"use client";

import React from "react";
import LiftComponent from "./liftComponent";
import { CalendarComponent } from "./calendarComponent";

function CalenderCenter() {
  return (
    <main className="min-h-screen w-full bg-[#0c0b19] text-white">
      <div className="flex w-full gap-13 px-5 py-7">

        {/* Left Sidebar */}
        <aside className="w-[260px] shrink-0">
          <LiftComponent />
        </aside>

        {/* Main Calendar */}
        <section className="min-w-0 flex-1">
          <CalendarComponent />
        </section>

      </div>
    </main>
  );
}

export default CalenderCenter;