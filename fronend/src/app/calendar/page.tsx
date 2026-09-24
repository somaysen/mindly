"use client";

import dynamic from "next/dynamic";

const CalendarComponent = dynamic(
  () =>
    import("../../features/calendar/components/calendar").then(
      (mod) => mod.CalendarComponent
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0c20] text-white/70">
        Loading calendar...
      </div>
    ),
  }
);

function Page() {
  return (
    <div>
      <CalendarComponent />
    </div>
  );
}

export default Page;
