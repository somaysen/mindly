import Topbar from "@/features/dashboard/components/Topbar";
import TaskbarCenter from "./calenderCenter";
import Sidebar from "@/components/Navber/Sidebar";

function Calendar() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0d0c1f]">
      {/* Global Navigation Sidebar (Slim) */}
      <aside className="w-[100px] shrink-0 z-50">
        <Sidebar />
      </aside>

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 h-screen">
        {/* Topbar */}
        <header className="h-[80px] shrink-0 px-6 flex items-center z-40">
          <Topbar />
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <TaskbarCenter />
        </main>
      </div>
    </div>
  );
}

export default Calendar;