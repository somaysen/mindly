"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

export default function Calendar() {
  const [selected, setSelected] = useState<Date | undefined>(
    new Date(2026, 7, 1),
  );

  return (
    <div
      className="mindly-calendar-wrapper w-full rounded-2xl
     bg-[#4d57dda4] text-white p-1 "
    >
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
        showOutsideDays={false}
        className="mindly-calendar"
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
    </div>
  );
}
