"use client";

import { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
import "react-day-picker/style.css";
import "@/components/calendar.css";

type Props = {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  showTasks: boolean;
  onShowTasksChange: (show: boolean) => void;
};

function LiftComponent({ selectedDate, onDateSelect, showTasks, onShowTasksChange }: Props) {
  const [month, setMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  useEffect(() => setMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)), [selectedDate.getFullYear(), selectedDate.getMonth()]);
  return (
    <aside className="w-full space-y-5">
      <div className="overflow-hidden rounded-[22px] bg-[#1b1b50] p-3">
        <DayPicker mode="single" selected={selectedDate} onSelect={(date) => date && onDateSelect(date)} month={month} onMonthChange={setMonth} showOutsideDays={false} weekStartsOn={1} className="mindly-calendar" components={{ Chevron: ({ orientation }) => orientation === "left" ? <ChevronLeft size={20} /> : <ChevronRight size={20} /> }} formatters={{ formatWeekdayName: (date) => ({ Mon: "M", Tue: "T", Wed: "W", Thu: "Th", Fri: "F", Sat: "S", Sun: "Su" }[date.toLocaleDateString("en-US", { weekday: "short" })] ?? "") }} />
      </div>

      <section className="rounded-[22px] bg-[#1b1b50] px-5 py-4">
        <div className="mb-4 flex items-center justify-between"><h2 className="text-[17px] font-semibold text-white">My Calendars</h2><ChevronUp size={20} className="text-[#a7a7bd]" /></div>
        <label className="flex cursor-pointer items-center gap-2.5 text-[16px] text-white"><input type="checkbox" checked={showTasks} onChange={(event) => onShowTasksChange(event.target.checked)} className="h-[15px] w-[15px] accent-[#6265f1]" />Daily tasks</label>
      </section>

      <section className="rounded-[22px] bg-[#1b1b50] px-5 py-4">
        <div className="mb-3 flex items-center justify-between"><h2 className="text-[17px] font-semibold text-white">Filters</h2><ChevronUp size={20} className="text-[#a7a7bd]" /></div>
        <p className="text-sm leading-5 text-[#b9bad6]">Tasks with a due date appear here. This app does not have event data yet.</p>
      </section>
    </aside>
  );
}

export default LiftComponent;
