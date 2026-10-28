"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowDownUp,
  FilePenLine,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import Calendar from "@/components/Calendar";
import { useTaskGet } from "@/features/tasks/hooks/useTesk";
import type { Task } from "@/types/task";
import TaskSchedule from "./TaskSchedule";
import CreateTaskModal from "./CreateTaskModal";
import TaskCard from "./TaskCard";

const getTodayInputDate = () => {
  const today = new Date();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
};

function TaskbarCenter() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const { data, isLoading, isError } = useTaskGet();

  const tasks = useMemo(() => {
    const allTasks = Array.isArray(data?.data) ? data.data : [];
    const query = search.trim().toLocaleLowerCase();

    return allTasks.filter((task) =>
      !query ||
      task.taskName.toLocaleLowerCase().includes(query) ||
      task.description?.toLocaleLowerCase().includes(query),
    );
  }, [data, search]);

  const visibleTasks = showAll ? tasks : tasks.slice(0, 4);
  const taskCount = Array.isArray(data?.data) ? data.data.length : 0;

  return (
    <main className="min-h-screen flex-1 overflow-y-auto overflow-x-hidden px-6 pb-6 pt-15 text-white">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_285px]">
          <section className="min-w-0">
            <div className="relative flex h-[190px] w-full items-start justify-between overflow-hidden">
              <div className="relative z-20">
                <h1 className="text-[25px] font-semibold">
                  {isLoading ? "Loading your tasks..." : taskCount ? "Your plans, in one place" : "Nothing planned yet"}
                </h1>
                <p className="mt-2 max-w-[250px] text-[12px] leading-5 text-[#A6A6BD]">
                  {taskCount
                    ? `${taskCount} ${taskCount === 1 ? "task" : "tasks"} ready for you. Keep your next step in focus.`
                    : "Create your first task and start building momentum."}
                </p>
              </div>
              <img
                src="/images/girl laptop 02 1.png"
                alt="Person planning tasks on a laptop"
                className="pointer-events-none absolute right-0 top-1/2 w-[250px] -translate-x-1/2 -translate-y-1/2 object-contain"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-5">
              <label className="flex h-11 w-full max-w-[400px] items-center gap-2 rounded-full border border-[#30304D] bg-[#18172F] px-3">
                <Search size={18} className="shrink-0 text-[#A9AAC8]" />
                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search tasks..."
                  aria-label="Search tasks"
                  className="w-full bg-transparent text-[12px] text-white outline-none placeholder:text-[#8D8DA8]"
                />
              </label>

              <div className="flex shrink-0 items-center gap-3">
                <button type="button" aria-label="Task filters" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#30304D] bg-[#18172F] text-[#A9AAC8]">
                  <SlidersHorizontal size={16} />
                </button>
                <button type="button" aria-label="Sort tasks" className="flex h-11 w-11 items-center justify-center rounded-full border border-[#30304D] bg-[#18172F] text-[#A9AAC8]">
                  <ArrowDownUp size={16} />
                </button>
              </div>
            </div>

            <section className="mt-7">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-[20px] font-medium">Your tasks</h2>
                <div className="flex items-center gap-4">
                  {tasks.length > 4 && (
                    <button type="button" onClick={() => setShowAll((value) => !value)} className="text-[13px] text-[#8588FA] transition hover:text-white">
                      {showAll ? "Show less" : "Show all"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(true)}
                    className="inline-flex items-center gap-1 rounded-full bg-[#5559ED] px-3 py-2 text-[12px] font-medium transition hover:bg-[#6569f5]"
                  >
                    <Plus size={15} /> Add task
                  </button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex min-h-[145px] items-center justify-center rounded-lg border border-[#252442] bg-[#191832] text-sm text-[#A6A6BD]">
                  Loading tasks...
                </div>
              ) : isError ? (
                <div role="alert" className="flex min-h-[145px] flex-col items-center justify-center rounded-lg border border-red-400/20 bg-[#191832] text-sm text-red-300">
                  <p>We couldn’t load your tasks.</p>
                  <p className="mt-1 text-xs text-white/50">Please try again in a moment.</p>
                </div>
              ) : tasks.length === 0 ? (
                <div className="flex min-h-[190px] flex-col items-center justify-center rounded-lg border border-[#252442] bg-[#191832] px-4 text-center">
                  <FilePenLine size={25} className="mb-2 text-[#B5B5C9]" />
                  <p className="text-[15px] text-[#B5B5C9]">{search ? "No tasks match your search." : "No tasks yet."}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleTasks.map((task: Task) => (
                    <TaskCard key={task._id} task={{ ...task, project: (task as Task & { project?: unknown }).project }} />
                  ))}
                </div>
              )}
            </section>
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
