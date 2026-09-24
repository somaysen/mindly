import Topbar from "@/features/dashboard/components/Topbar";
import TaskbarCenter from "./calenderCenter";
import Sidebar from "@/components/Navber/Sidebar";

function calendar() {
  return (
    <div className="h-screen w-full  overflow-hidden bg-[#0d0c1f]">
      <aside className="fixed h-40 left-10 top-8 z-50 h-screen w-[260px]">
        <Sidebar />
      </aside>

      {/* Main Area */}
      <div className="ml-[260px] W-[50%] h-screen">
        {/* Fixed Topbar */}
        <div className="fixed left-[150px] right-5 top-3 z-50">
          <Topbar />
        </div>

        {/* Scrollable Content */}
        <main className="h-screen left-[150px]  overflow-y-auto pt-[80px] scrollbar-hide">
          <TaskbarCenter />
        </main>
      </div>
    </div>
  );
}

export default calendar;
