"use client";

import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-day-picker/style.css";
import "./calendar.css";

export default function Calendar() {
  const [selected, setSelected] = useState<Date | undefined>(
    new Date(2026, 7, 20),
  );

  return (
    <div className="mindly-calendar-wrapper">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={setSelected}
        month={new Date(2026, 7)}
        showOutsideDays={false}
        weekStartsOn={1}
        className="mindly-calendar"
        components={{
          Chevron: ({ orientation }) =>
            orientation === "left" ? (
              <ChevronLeft size={20} />
            ) : (
              <ChevronRight size={20} />
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

            return names[day];
          },
        }}
      />
    </div>
  );
}
