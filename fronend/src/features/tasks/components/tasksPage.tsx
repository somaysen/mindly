import TaskSidebar from "./taskSidebar";
import Topbar from "@/features/dashboard/components/Topbar";
import TaskbarCenter from "./TaskbarCenter";

function TasksPage() {
  return (
    <div className="h-screen w-full overflow-hidden bg-[#0d0c0f]">
      <aside className="fixed left-8 top-5 z-50 h-screen w-[260px]">
        <TaskSidebar />
      </aside>

      {/* Main Area */}
      <div className="ml-[260px] h-screen">
        {/* Fixed Topbar */}
        <div className="fixed left-[350px] right-5 top-0 z-50">
          <Topbar />
        </div>

        {/* Scrollable Content */}
        <main className="h-screen overflow-y-auto pt-[80px] scrollbar-hide">
          <TaskbarCenter />
        </main>
      </div>
    </div>
  );
}

export default TasksPage;
