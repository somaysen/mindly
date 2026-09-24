import BryntumCalendarWrapper from "@/features/calendar/components/BryntumCalendarWrapper";

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-[#0c0b19] p-6 text-white">
      <BryntumCalendarWrapper
        date={new Date(2026, 8, 24)}
        mode="month"
        events={[]}
      />
    </main>
  );
}
