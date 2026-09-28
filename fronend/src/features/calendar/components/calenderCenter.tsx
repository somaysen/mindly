"use client";

import React from "react";
import LiftComponent from "./liftComponent";
import { CalendarComponent } from "./calendarComponent";

function CalenderCenter() {
  return (
    <div className="flex w-full h-full gap-8 px-6 pb-6 text-white">
      {/* Secondary Sidebar (Mini-calendar, Filters) */}
      <aside className="w-[280px] shrink-0">
        <LiftComponent />
      </aside>

      {/* Main Calendar View */}
      <section className="min-w-0 flex-1 bg-transparent rounded-xl">
        <CalendarComponent />
      </section>
    </div>
  );
}

export default CalenderCenter;