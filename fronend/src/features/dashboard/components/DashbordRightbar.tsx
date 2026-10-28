import dynamic from "next/dynamic";

const LazyCalendar = dynamic(() => import("@/components/Calendar"), {
  loading: () => (
    <div className="h-[300px] animate-pulse rounded-2xl border border-[#383653] bg-[#191832]/70" />
  ),
});

function DashbordRightbar() {
  return (
    <div>
      <aside className="w-full space-y-6">
        {/* REMINDER */}

        <section className="rounded-[18px] border border-[#4a4771] bg-[#24234d] p-5">
          <h2 className="font-[family-name:var(--font-bricolage-grotesque)] text-xl font-medium">
            Reminder
          </h2>

          <p className="mt-2 text-sm font-medium">Start small.</p>

          <p className="mt-5 text-sm leading-5 text-white/75">
            You don&apos;t have to organize everything today, just capture your
            first thought.
          </p>
        </section>

        {/* CALENDAR */}

        <LazyCalendar />
      </aside>
    </div>
  );
}

export default DashbordRightbar;
