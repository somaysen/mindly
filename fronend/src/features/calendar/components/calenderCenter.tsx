"use client";

import { useState } from "react";
import LiftComponent from "./liftComponent";
import { CalendarComponent } from "./calendarComponent";

function CalenderCenter() {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [showTasks, setShowTasks] = useState(true);
  return (
    <div className="flex min-h-full w-full flex-col gap-6 px-6 pb-6 text-white lg:flex-row lg:gap-8">
      {/* Secondary Sidebar (Mini-calendar, Filters) */}
      <aside className="w-full shrink-0 lg:w-[260px]">
        <LiftComponent selectedDate={selectedDate} onDateSelect={setSelectedDate} showTasks={showTasks} onShowTasksChange={setShowTasks} />
      </aside>

      {/* Main Calendar View */}
      <section className="min-w-0 flex-1 bg-transparent rounded-xl">
        <CalendarComponent selectedDate={selectedDate} onDateSelect={setSelectedDate} showTasks={showTasks} />
      </section>
    </div>
  );
}

export default CalenderCenter;
