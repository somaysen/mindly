"use client";

import React, { useMemo, useState } from "react";
import { ChevronUp, Lightbulb, Mic, Paperclip } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { useTaskCreate, useTaskGet } from "@/features/tasks/hooks/useTesk";
import { useUserInfo } from "@/features/dashboard/hooks/useDashboard";

import DashbordFocus from "./DashbordFocus";
import DashbordRightbar from "./DashbordRightbar";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function DashbordCenter() {
  const queryClient = useQueryClient();
  const [thought, setThought] = useState("");
  const [isThoughtExpanded, setIsThoughtExpanded] = useState(true);

  // =====================================================
  // USER INFO
  // =====================================================
  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useUserInfo();

  // Backend: { success, message, data: { name, ... } }
  const userName = userData?.data?.name ?? "User";

  // =====================================================
  // CREATE TASK
  // =====================================================
  const {
    mutate: createTask,
    isPending: isCreatingTask,
    isSuccess: isTaskCreated,
    isError: isCreateError,
    error: createError,
  } = useTaskCreate();

  // =====================================================
  // GET TASKS
  // =====================================================
  const {
    data: tasksData,
    isLoading: isTasksLoading,
    isError: isTasksGetError,
  } = useTaskGet();

  // Guard: only treat it as a list if it actually is one.
  const tasks = useMemo(
    () => (Array.isArray(tasksData?.data) ? tasksData.data : []),
    [tasksData],
  );

  // =====================================================
  // CREATE TASK
  // =====================================================
  const handleCreateTask = () => {
    const value = thought.trim();
    if (!value || isCreatingTask) return;

    const formData = new FormData();
    formData.append("taskName", value);
    formData.append("description", value);
    formData.append("priority", "medium");
    formData.append("status", "todo");

    createTask(formData, {
      onSuccess: () => {
        setThought("");
        // Must match useTaskGet's queryKey exactly.
        queryClient.invalidateQueries({ queryKey: ["getTasks"] });
      },
    });
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="grid gap-4 pb-8 pt-2 xl:grid-cols-[minmax(0,1fr)_292px]">
      <section className="min-w-0">
        {/* HERO */}
        <div className="flex min-h-[205px] items-center justify-between gap-6 px-1 sm:px-5">
          <div className="min-w-0">
            <h1 className="font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-semibold tracking-[-0.02em] sm:text-[28px]">
              {getGreeting()},{" "}
              {isUserLoading ? "..." : userName}
            </h1>

            {isUserError ? (
              <p className="mt-2 text-xs text-red-400">
                Unable to load your profile.
              </p>
            ) : (
              <p className="mt-3 text-sm text-white/60 sm:text-[15px]">
                Let&apos;s start by clearing your mind.
              </p>
            )}
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
            <Lightbulb size={21} strokeWidth={1.8} className="text-white/80" />
            <span className="font-[family-name:var(--font-bricolage-grotesque)] text-base font-medium sm:text-lg">
              What&apos;s on your mind?
            </span>
            <button
              type="button"
              onClick={() => setIsThoughtExpanded((expanded) => !expanded)}
              aria-label={
                isThoughtExpanded ? "Collapse thought editor" : "Expand thought editor"
              }
              aria-expanded={isThoughtExpanded}
              className="ml-auto rounded-full p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
            >
              <ChevronUp
                size={20}
                className={`transition-transform ${isThoughtExpanded ? "" : "rotate-180"}`}
              />
            </button>
          </div>

          {isThoughtExpanded && (
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleCreateTask();
                }
              }}
              placeholder="e.g. Finish the landing page copy..."
              rows={Math.min(5, Math.max(1, thought.split("\n").length))}
              aria-label="Thought to organize"
              className="mt-1 w-full resize-none bg-transparent text-sm italic text-white/70 placeholder:text-white/30 focus:outline-none"
            />
          )}

          {isThoughtExpanded && (
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
                onClick={handleCreateTask}
                disabled={isCreatingTask || !thought.trim()}
                className="flex h-8 items-center gap-2 rounded-full bg-[#5965ed] px-4 text-xs font-medium transition hover:bg-[#6d78f4] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Lightbulb size={14} />
                {isCreatingTask ? "Saving..." : "Organize"}
              </button>
            </div>
          )}
        </div>

        {/* TODAY'S FOCUS */}
        <DashbordFocus
          tasks={tasks}
          isTasksLoading={isTasksLoading}
          isTasksGetError={isTasksGetError}
          handleCreateTask={handleCreateTask}
          isCreatingTask={isCreatingTask}
          isTaskCreated={isTaskCreated}
          isCreateError={isCreateError}
          createError={createError}
        />
      </section>

      <DashbordRightbar />
    </div>
  );
}

export default DashbordCenter;
