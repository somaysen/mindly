"use client";

import dynamic from "next/dynamic";
import type { BryntumCalendarProps } from "@bryntum/calendar-react";

const BryntumCalendar = dynamic(
  () => import("./BryntumCalendar").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100vh-120px)] min-h-[620px] items-center justify-center rounded-2xl border border-[#252442] bg-[#17162f] text-sm text-white/60">
        Loading calendar...
      </div>
    ),
  },
);

export default function BryntumCalendarWrapper(
  props: BryntumCalendarProps,
) {
  return <BryntumCalendar {...props} />;
}
