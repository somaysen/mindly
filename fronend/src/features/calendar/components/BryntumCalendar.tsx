"use client";

import { useRef } from "react";
import { BryntumCalendar, BryntumCalendarProps } from "@bryntum/calendar-react";


const events: BryntumCalendarProps["events"] = [
  {
    id: 1,
    name: "Focus session",
    startDate: "2026-09-24T09:00:00",
    endDate: "2026-09-24T10:00:00",
    eventColor: "violet",
  },
  {
    id: 2,
    name: "Project work",
    startDate: "2026-09-24T11:00:00",
    endDate: "2026-09-24T12:30:00",
    eventColor: "blue",
  },
  {
    id: 3,
    name: "Weekly reflection",
    startDate: "2026-09-25T16:00:00",
    endDate: "2026-09-25T16:30:00",
    eventColor: "green",
  },
];

export default function BryntumCalendarView(props: BryntumCalendarProps) {
  const calendarRef = useRef<BryntumCalendar>(null);

  const calendarConfig: BryntumCalendarProps = {
    autoHeight: false,
    date: new Date(2026, 8, 24),
    mode: "month",
    modes: {
      month: {
        title: "Month",
      },
      week: {
        title: "Week",
      },
      day: {
        title: "Day",
      },
      agenda: {
        title: "Agenda",
      },
    },
    events,
    ...props,
  };

  return (
    <div className="h-[calc(100vh-120px)] min-h-[620px] w-full overflow-hidden rounded-2xl border border-[#252442] bg-[#17162f]">
      <BryntumCalendar ref={calendarRef} {...calendarConfig} />
    </div>
  );
}
