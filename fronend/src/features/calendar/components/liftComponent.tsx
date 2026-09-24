"use client";

import React from "react";
import Calendar from "@/components/Calendar";
import { ChevronUp } from "lucide-react";

function LiftComponent() {
  return (
    <aside className="w-[290px] shrink-0 space-y-5">
      {/* ================= CALENDAR ================= */}
      <div className="overflow-hidden rounded-[22px] bg-[#1b1b50] p-3">
        <Calendar />
      </div>

      {/* ================= MY CALENDARS ================= */}
      <div className="rounded-[22px] bg-[#1b1b50] px-5 py-4">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-white">
            My Calendars
          </h2>

          <ChevronUp
            size={20}
            strokeWidth={2.5}
            className="text-[#a7a7bd]"
          />
        </div>

        {/* Calendar Options */}
        <div className="space-y-3">
          <CalendarOption label="Daily tasks" />
          <CalendarOption label="Mindly" />
          <CalendarOption label="School" />
        </div>
      </div>

      {/* ================= FILTERS ================= */}
      <div className="rounded-[22px] bg-[#1b1b50] px-5 py-4">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-white">
            Filters
          </h2>

          <ChevronUp
            size={20}
            strokeWidth={2.5}
            className="text-[#a7a7bd]"
          />
        </div>

        {/* Filter Options */}
        <div className="space-y-3">
          <CalendarOption label="Daily tasks" />
          <CalendarOption label="Birthdays" />
          <CalendarOption label="Events" />
        </div>
      </div>
    </aside>
  );
}

/* ================= CHECKBOX OPTION ================= */

function CalendarOption({ label }: { label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[16px] text-white">
      <input
        type="checkbox"
        className="
          h-[14px]
          w-[14px]
          cursor-pointer
          appearance-none
          rounded-[4px]
          border-2
          border-white
          bg-transparent
          checked:border-[#6366f1]
          checked:bg-[#6366f1]
        "
      />

      <span>{label}</span>
    </label>
  );
}

export default LiftComponent;