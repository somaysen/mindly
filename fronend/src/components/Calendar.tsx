"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CreateTaskModal from "@/features/tasks/components/CreateTaskModal";
import "react-day-picker/style.css";
import "./calendar.css";

const dateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function Calendar() {
  const today = new Date();
  const [selected, setSelected] = useState<Date>(today);
  const [month, setMonth] = useState<Date>(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [modalDate, setModalDate] = useState<string | null>(null);

  return (
    <div className="mindly-calendar-wrapper">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => {
          if (!date) return;
          setSelected(date);
          setModalDate(dateKey(date));
        }}
        month={month}
        onMonthChange={setMonth}
        today={today}
        showOutsideDays={false}
        weekStartsOn={1}
        className="mindly-calendar"
        components={{
          Chevron: ({ orientation }) =>
            orientation === "left" ? (
              <ChevronLeft size={20} aria-hidden="true" />
            ) : (
              <ChevronRight size={20} aria-hidden="true" />
            ),
        }}
        formatters={{
          formatWeekdayName: (date) => {
            const day = date.toLocaleDateString("en-US", {
              weekday: "short",
            });
            const names: Record<string, string> = {
              Mon: "M",
              Tue: "T",
              Wed: "W",
              Thu: "Th",
              Fri: "F",
              Sat: "Sa",
              Sun: "S",
            };
            return names[day] ?? day;
          },
        }}
      />
      {modalDate && (
        <CreateTaskModal
          dueDate={modalDate}
          onClose={() => setModalDate(null)}
        />
      )}
    </div>
  );
}
