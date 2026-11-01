"use client";

import { useState } from "react";

import Topbar from "@/components/Navber/Topbar";
import TaskSidebar from "./taskSidebar";
import type { TaskView } from "./taskSidebar";
import TaskbarCenter from "./TaskCenter";

function TasksPage() {
  const [activeView, setActiveView] = useState<TaskView | null>(null);

  return (
    <div className="h-dvh w-full overflow-hidden bg-[#0d0c1f]">
      <aside className="fixed left-8 top-5 z-50 hidden h-screen w-[291px] xl:block">
        <TaskSidebar activeView={activeView} onViewChange={setActiveView} />
      </aside>

      <div className="h-full xl:ml-[291px]">
        <div className="fixed left-3 right-3 top-0 z-50 xl:left-[350px] xl:right-5">
          <Topbar />
        </div>

        <main className="h-full overflow-y-auto px-3 pb-24 pt-[76px] scrollbar-hide sm:px-5 sm:pt-[88px] xl:ml-[39px] xl:px-0 xl:pb-6 xl:pt-[80px]">
          <TaskbarCenter activeView={activeView} />
        </main>
      </div>
    </div>
  );
}

export default TasksPage;
