"use client";

import { useState } from "react";

import Topbar from "@/components/Navber/Topbar";
import TaskSidebar from "./TaskSidebar";
import type { TaskView } from "./TaskSidebar";
import TaskbarCenter from "./TaskCenter";

function TasksPage() {
  const [activeView, setActiveView] = useState<TaskView | null>(null);

  return (
    <div className="h-screen w-full overflow-hidden bg-[#0d0c1f]">
      <aside className="fixed left-8 top-5 z-50 h-screen w-[260px]">
        <TaskSidebar activeView={activeView} onViewChange={setActiveView} />
      </aside>

      <div className="ml-[260px] h-screen">
        <div className="fixed left-[350px] right-5 top-0 z-50">
          <Topbar />
        </div>

        <main className="ml-[70px] h-screen overflow-y-auto pt-[80px] scrollbar-hide">
          <TaskbarCenter activeView={activeView} />
        </main>
      </div>
    </div>
  );
}

export default TasksPage;
