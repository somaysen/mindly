"use client";

import { useMemo, useState } from "react";
import { ArrowDownUp, FilePenLine, ListTodo, Plus, Search } from "lucide-react";

import { useTaskGet } from "@/features/tasks/hooks/useTesk";
import type { Task } from "@/types/task";
import TaskCard from "./TaskCard";

interface TaskPageCenterProps {
  onAddTask: () => void;
  showAllTasks?: boolean;
}

export default function TaskPageCenter({ onAddTask, showAllTasks = false }: TaskPageCenterProps) {
  const { data, isLoading, isError } = useTaskGet();
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(showAllTasks);
  const [ascending, setAscending] = useState(true);
  const taskCount = Array.isArray(data?.data) ? data.data.length : 0;

  const tasks = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return [...(data?.data ?? [])]
      .filter((task) =>
        !query ||
        task.taskName.toLocaleLowerCase().includes(query) ||
        task.description?.toLocaleLowerCase().includes(query),
      )
      .sort((a, b) => {
        const byDate = (a.dueDate ?? "9999-99-99").localeCompare(b.dueDate ?? "9999-99-99") ||
          (a.dueTime ?? "99:99").localeCompare(b.dueTime ?? "99:99");
        return ascending ? byDate : -byDate;
      });
  }, [data, search, ascending]);

  const visibleTasks = showAll ? tasks : tasks.slice(0, 4);

  return (
    <section className="min-w-0">
      <div className="relative flex min-h-[175px] items-center justify-between overflow-hidden rounded-2xl border border-[#30304D] bg-gradient-to-r from-[#191832] to-[#25234b] px-5 py-5 sm:px-7">
        <div className="relative z-10 max-w-[58%]">
          <h1 className="text-xl font-semibold sm:text-[25px]">
            {isLoading ? "Loading your tasks..." : taskCount ? "Your plans, in one place" : "Nothing planned yet"}
          </h1>
          <p className="mt-2 text-xs leading-5 text-[#A6A6BD] sm:max-w-[310px] sm:text-sm">
            {taskCount
              ? `${taskCount} ${taskCount === 1 ? "task" : "tasks"} ready for you. Keep your next step in focus.`
              : "Create your first task and start building momentum."}
          </p>
        </div>
        <img
          src="/images/girl laptop 02 1.png"
          alt="Person planning tasks on a laptop"
          className="pointer-events-none absolute bottom-0 right-0 h-full max-w-[48%] object-contain object-bottom"
        />
      </div>

      <div className="mt-5 flex items-center gap-3">
        <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border border-[#30304D] bg-[#18172F] px-3 sm:max-w-[400px]">
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
        <button
          type="button"
          aria-label={`Sort tasks by due date ${ascending ? "descending" : "ascending"}`}
          onClick={() => setAscending((current) => !current)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#30304D] bg-[#18172F] text-[#A9AAC8] transition hover:text-white"
        >
          <ArrowDownUp size={16} />
        </button>
      </div>

      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-medium sm:text-[20px]">Your tasks</h2>
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {tasks.length > 4 && !showAllTasks && (
              <button
                type="button"
                onClick={() => setShowAll((value) => !value)}
                className="text-xs text-[#8588FA] transition hover:text-white sm:text-[13px]"
              >
                {showAll ? "Show less" : "Show all"}
              </button>
            )}
            <button
              type="button"
              onClick={onAddTask}
              className="inline-flex items-center gap-1 rounded-full bg-[#5559ED] px-3 py-2 text-xs font-medium transition hover:bg-[#6569f5]"
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
            <p>We couldn&apos;t load your tasks.</p>
            <p className="mt-1 text-xs text-white/50">Please try again in a moment.</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex min-h-[190px] flex-col items-center justify-center rounded-lg border border-[#252442] bg-[#191832] px-4 text-center">
            {search ? <Search size={25} className="mb-2 text-[#B5B5C9]" /> : <FilePenLine size={25} className="mb-2 text-[#B5B5C9]" />}
            <p className="text-[15px] text-[#B5B5C9]">{search ? "No tasks match your search." : "No tasks yet."}</p>
            {!search && <ListTodo size={16} className="mt-2 text-[#8588FA]" />}
          </div>
        ) : (
          <div className="space-y-3">
            {visibleTasks.map((task: Task) => (
              <TaskCard
                key={task._id}
                task={{ ...task, project: (task as Task & { project?: unknown }).project }}
                className="rounded-2xl border border-[#383653] bg-[#191832]/90 p-4 transition hover:border-[#5b5884] sm:p-5"
              />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
