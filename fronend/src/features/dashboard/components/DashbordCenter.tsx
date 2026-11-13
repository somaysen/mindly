"use client";

import React, { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import { useTaskGet } from "@/features/tasks/hooks/useTesk";
import { useUserInfo } from "@/features/dashboard/hooks/useDashboard";
import type { DashboardView } from "./DashboradSidbar";

import DashbordFocus from "./DashbordFocus";
import DashbordRightbar from "./DashbordRightbar";
import MindlyBox from "@/features/ThoughtBox/components/MindlyBox";
import CreateTaskModal from "@/features/tasks/components/TaskCreteModel";

const DashbordToday = dynamic(() => import("./DashbordToday"));
const DashBoradUpcoming = dynamic(() => import("./DashBoradUpcoming"));
const DeshboradCompleted = dynamic(() => import("./DeshboradCompleted"));
const getTodayDate = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function DashbordCenter({ activeView }: { activeView: DashboardView }) {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    setGreeting(getGreeting());
  }, []);

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
  // UI
  // =====================================================
  return (
    <div className="grid gap-4 pb-8 pt-2 xl:grid-cols-[minmax(0,1fr)_292px]">
      
      {activeView === "today" ? (
        <DashbordToday />
      ) : activeView === "upcoming" ? (
        <DashBoradUpcoming />
      ) : activeView === "completed" ? (
        <DeshboradCompleted />
      ) : (
        <section className="min-w-0">
        {/* HERO */}
        <div className="flex min-h-[205px] items-center justify-between gap-6 px-1 sm:px-5">
          <div className="min-w-0">
            <h1 className="font-[family-name:var(--font-bricolage-grotesque)] text-2xl font-semibold tracking-[-0.02em] sm:text-[28px]">
              {greeting},{" "}
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
        <MindlyBox />

        {/* TODAY'S FOCUS */}
        <DashbordFocus
          tasks={tasks}
          isTasksLoading={isTasksLoading}
          isTasksGetError={isTasksGetError}
          onAddTask={() => setIsCreateTaskOpen(true)}
        />
        </section>
      )}

      <DashbordRightbar />
      {isCreateTaskOpen && (
        <CreateTaskModal
          dueDate={getTodayDate()}
          onClose={() => setIsCreateTaskOpen(false)}
        />
      )}
    </div>
  );
}

export default DashbordCenter;
