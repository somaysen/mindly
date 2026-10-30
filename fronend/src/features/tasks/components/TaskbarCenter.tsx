"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronUp, Lightbulb, Mic, Paperclip } from "lucide-react";

import Calendar from "@/components/Calendar";
import { useUserInfo } from "@/features/dashboard/hooks/useDashboard";
import DashbordToday from "@/features/dashboard/components/DashbordToday";
import DashboardTaskList from "@/features/dashboard/components/DashboardTaskList";
import { useTaskCreate } from "@/features/tasks/hooks/useTesk";
import AllTask from "./AllTask";
import CreateTaskModal from "./TaskCreteModel";
import TaskSchedule from "./TaskSchedule";

type TaskView = "all" | "today" | "upcoming" | "completed";

const getTodayInputDate = () => {
  const today = new Date();
  return `${today.getFullYear()}-${`${today.getMonth() + 1}`.padStart(2, "0")}-${`${today.getDate()}`.padStart(2, "0")}`;
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function TaskbarCenter() {
  const pathname = usePathname();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [thought, setThought] = useState("");
  const [isThoughtExpanded, setIsThoughtExpanded] = useState(true);
  const { data: userData, isLoading: isUserLoading, isError: isUserError } = useUserInfo();
  const userName = userData?.data?.name ?? "User";
  const {
    mutate: createTask,
    isPending: isCreatingTask,
    isSuccess: isTaskCreated,
    isError: isCreateError,
    error: createError,
  } = useTaskCreate();

  const activeView: TaskView = pathname === "/tasks/today"
    ? "today"
    : pathname === "/tasks/upcoming"
      ? "upcoming"
      : pathname === "/tasks/completed"
        ? "completed"
        : "all";

  const handleCreateTask = () => {
    const value = thought.trim();
    if (!value || isCreatingTask) return;

    const formData = new FormData();
    formData.append("taskName", value);
    formData.append("description", value);
    formData.append("priority", "medium");
    formData.append("status", "todo");
    createTask(formData, { onSuccess: () => setThought("") });
  };

  return (
    <main className="h-full min-w-0 overflow-y-auto overflow-x-hidden px-4 pb-6 pt-16 text-white sm:px-6">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_285px]">
          <section className="min-w-0">
            {activeView === "all" ? (
              <>
                <div className="mb-5 flex min-h-[150px] items-center justify-between gap-5 px-1 sm:px-5">
                  <div className="min-w-0">
                    <h1 className="font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-semibold tracking-[-0.02em] sm:text-[28px]">
                      {getGreeting()}, {isUserLoading ? "..." : userName}
                    </h1>
                    <p className="mt-3 text-sm text-white/60">
                      {isUserError ? "Unable to load your profile." : "Let’s start by clearing your mind."}
                    </p>
                  </div>
                  <img src="/images/girl laptop 02 1.png" alt="Person organizing thoughts on a laptop" className="hidden h-[140px] w-[200px] shrink-0 object-contain sm:block" />
                </div>

                <div className="mb-6 rounded-[18px] border border-[#48466f] bg-[#19183d] p-4 shadow-[0_18px_45px_rgba(5,4,25,0.18)] sm:p-5">
                  <div className="flex items-center gap-3">
                    <Lightbulb size={21} strokeWidth={1.8} className="text-white/80" />
                    <span className="font-[family-name:var(--font-bricolage-grotesque)] text-base font-medium sm:text-lg">What&apos;s on your mind?</span>
                    <button type="button" onClick={() => setIsThoughtExpanded((expanded) => !expanded)} aria-label={isThoughtExpanded ? "Collapse thought editor" : "Expand thought editor"} aria-expanded={isThoughtExpanded} className="ml-auto rounded-full p-1 text-white/50 transition hover:bg-white/10 hover:text-white">
                      <ChevronUp size={20} className={`transition-transform ${isThoughtExpanded ? "" : "rotate-180"}`} />
                    </button>
                  </div>
                  {isThoughtExpanded && (
                    <>
                      <textarea value={thought} onChange={(event) => setThought(event.target.value)} onKeyDown={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          event.preventDefault();
                          handleCreateTask();
                        }
                      }} placeholder="e.g. Finish the landing page copy..." rows={Math.min(5, Math.max(1, thought.split("\n").length))} aria-label="Thought to organize" className="mt-1 w-full resize-none bg-transparent text-sm italic text-white/70 placeholder:text-white/30 focus:outline-none" />
                      <div className="mt-10 flex justify-end gap-2">
                        <button type="button" aria-label="Record a thought" className="grid h-8 w-8 place-items-center rounded-full bg-[#555574] text-white/80 transition hover:bg-[#68688c]"><Mic size={15} /></button>
                        <button type="button" aria-label="Attach a file" className="grid h-8 w-8 place-items-center rounded-full bg-[#555574] text-white/80 transition hover:bg-[#68688c]"><Paperclip size={15} /></button>
                        <button type="button" onClick={handleCreateTask} disabled={isCreatingTask || !thought.trim()} className="flex h-8 items-center gap-2 rounded-full bg-[#5965ed] px-4 text-xs font-medium transition hover:bg-[#6d78f4] disabled:cursor-not-allowed disabled:opacity-50">
                          <Lightbulb size={14} /> {isCreatingTask ? "Saving..." : "Organize"}
                        </button>
                      </div>
                    </>
                  )}
                  {isTaskCreated && !isCreateError && <p className="mt-3 text-xs font-medium text-emerald-300">Task created successfully.</p>}
                  {isCreateError && <p role="alert" className="mt-3 text-xs font-medium text-rose-300">{createError instanceof Error ? createError.message : "Failed to create task."}</p>}
                </div>
                <AllTask onAddTask={() => setIsCreateOpen(true)} />
              </>
            ) : activeView === "today" ? (
              <DashbordToday onAddTask={() => setIsCreateOpen(true)} />
            ) : (
              <DashboardTaskList mode={activeView} />
            )}
          </section>

          <aside className="flex w-full flex-col gap-4 xl:w-[285px]">
            <div className="overflow-hidden rounded-xl border border-[#30304D] bg-[#191832]"><Calendar /></div>
            <div className="overflow-hidden rounded-xl border border-[#30304D] bg-[#191832]"><TaskSchedule /></div>
          </aside>
        </div>
      </div>
      {isCreateOpen && <CreateTaskModal dueDate={getTodayInputDate()} onClose={() => setIsCreateOpen(false)} />}
    </main>
  );
}

export default TaskbarCenter;
