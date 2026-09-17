import Calendar from "@/components/Calendar";
import DashboradSidbar from "@/features/dashboard/components/DashboradSidbar";
import Topbar from "@/features/dashboard/components/Topbar";
import {
  Lightbulb,
  Mic,
  Paperclip,
  Plus,
} from "lucide-react";

function Page() {
  return (
    <div className="min-h-screen w-full bg-[#0d0c20] px-3 py-3 text-white sm:px-5 sm:py-5 lg:px-7">
      <div className="mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-[1590px] gap-8">
        {/* LEFT SIDEBAR */}
        <DashboradSidbar />

        {/* MAIN CONTENT */}
        <main className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-[22px] ">
            <Topbar />

            {/* CENTER + RIGHT SIDEBAR */}
            <div className="grid gap-4 pt-2 pb-8 xl:grid-cols-[minmax(0,1fr)_292px]">
              {/* CENTER CONTENT */}
              <section className="min-w-0">
                {/* HERO */}
                <div className="flex min-h-[205px] items-center justify-between gap-6 px-1 sm:px-5">
                  <div className="min-w-0">
                    <h1 className="font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-semibold tracking-[-0.02em] sm:text-[28px]">
                      Good evening, Tanya
                    </h1>

                    <p className="mt-3 text-sm text-white/60 sm:text-[15px]">
                      Let&apos;s start by clearing your mind.
                    </p>
                  </div>

                  <img
                    src="/images/girl laptop 02 1.png"
                    alt="Person organizing thoughts on a laptop"
                    className="hidden h-[190px] w-[260px] shrink-0 object-contain sm:block"
                  />
                </div>

                {/* THOUGHT BOX */}
                <div className="rounded-[18px] border border-[#48466f] bg-[#19183d] p-4 shadow-[0_18px_45px_rgba(5,4,25,0.18)] sm:p-5">
                  <div className="flex items-center gap-3">
                    <Lightbulb
                      size={21}
                      strokeWidth={1.8}
                      className="text-white/80"
                    />

                    <span className="font-[family-name:var(--font-bricolage-grotesque)] text-base font-medium sm:text-lg">
                      What&apos;s on your mind?
                    </span>

                    <span className="ml-auto text-2xl leading-none text-white/50">
                      ⌃
                    </span>
                  </div>

                  <p className="mt-1 text-sm italic text-white/30">
                    e.g. Finish the landing page copy...
                  </p>

                  <div className="mt-16 flex justify-end gap-2">
                    <button
                      type="button"
                      aria-label="Record a thought"
                      className="grid h-8 w-8 place-items-center rounded-full bg-[#555574] text-white/80 transition hover:bg-[#68688c]"
                    >
                      <Mic size={15} />
                    </button>

                    <button
                      type="button"
                      aria-label="Attach a file"
                      className="grid h-8 w-8 place-items-center rounded-full bg-[#555574] text-white/80 transition hover:bg-[#68688c]"
                    >
                      <Paperclip size={15} />
                    </button>

                    <button
                      type="button"
                      className="flex h-8 items-center gap-2 rounded-full bg-[#5965ed] px-4 text-xs font-medium transition hover:bg-[#6d78f4]"
                    >
                      <Lightbulb size={14} />
                      Organize
                    </button>
                  </div>
                </div>

                {/* TODAY'S FOCUS */}
                <div className="mt-8">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-[family-name:var(--font-bricolage-grotesque)] text-lg font-medium">
                      Today&apos;s Focus
                    </h2>

                    <button
                      type="button"
                      className="text-xs text-white/45 transition hover:text-white/75"
                    >
                      Show all
                    </button>
                  </div>

                  <button
                    type="button"
                    className="flex h-14 w-full items-center gap-3 rounded-[17px] border border-dashed border-[#585675] bg-[#171633] px-4 text-sm text-white/50 transition hover:border-[#7775a0] hover:text-white/80"
                  >
                    <Plus size={26} strokeWidth={1.5} />
                    Create your first task
                  </button>
                </div>
              </section>

              {/* RIGHT SIDEBAR */}
              <aside className="w-full space-y-6">
                {/* REMINDER */}
                <section className="rounded-[18px] border border-[#4a4771] bg-[#24234d] p-5">
                  <h2 className="font-[family-name:var(--font-bricolage-grotesque)] text-xl font-medium">
                    Reminder
                  </h2>

                  <p className="mt-2 text-sm font-medium">
                    Start small.
                  </p>

                  <p className="mt-5 text-sm leading-5 text-white/75">
                    You don&apos;t have to organize everything today, just
                    capture your first thought.
                  </p>
                </section>

                {/* CALENDAR */}
                <Calendar />
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Page;