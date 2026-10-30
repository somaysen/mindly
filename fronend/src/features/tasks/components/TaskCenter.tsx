"use client";

import { useState } from "react";

import Calendar from "@/components/Calendar";
import DashbordToday from "@/features/dashboard/components/DashbordToday";
import DashboardTaskList from "@/features/dashboard/components/DashboardTaskList";
import AllTask from "./AllTask";
import CreateTaskModal from "./TaskCreteModel";
import TaskPageCenter from "./TaskPageCenter";
import TaskSchedule from "./TaskSchedule";
import type { TaskView } from "./TaskSidebar";

const getTodayInputDate = () => {
  const today = new Date();
  const month = `${today.getMonth() + 1}`.padStart(2, "0");
  const day = `${today.getDate()}`.padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
};

function TaskbarCenter({ activeView }: { activeView: TaskView | null }) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const openCreateTask = () => setIsCreateOpen(true);

  return (
    <main className="h-full min-w-0 overflow-y-auto overflow-x-hidden px-4 pb-6 pt-16 text-white sm:px-6">
      <div className="mx-auto w-full max-w-[1400px]">
        <div className="grid w-full grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_285px]">
          {activeView === null ? (
            <TaskPageCenter onAddTask={openCreateTask} />
          ) : activeView === "all" ? (
            <AllTask onAddTask={openCreateTask} />
          ) : activeView === "today" ? (
            <DashbordToday onAddTask={openCreateTask} />
          ) : (
            <DashboardTaskList mode={activeView} />
          )}
          <aside className="flex w-full flex-col gap-4 xl:w-[285px]">
            <div className="overflow-hidden rounded-xl border border-[#30304D] bg-[#191832]">
              <Calendar />
            </div>
            <div className="overflow-hidden rounded-xl border border-[#30304D] bg-[#191832]">
              <TaskSchedule />
            </div>
          </aside>
        </div>
      </div>

      {isCreateOpen && (
        <CreateTaskModal
          dueDate={getTodayInputDate()}
          onClose={() => setIsCreateOpen(false)}
        />
      )}
    </main>
  );
}

export default TaskbarCenter;
