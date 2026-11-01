import Topbar from "@/components/Navber/Topbar";
import TaskbarCenter from "./calenderCenter";
import Sidebar from "@/components/Navber/Sidebar";

function Calendar() {
  return (
    <div className="absolute flex h-dvh w-full overflow-hidden bg-[#0d0c1f]">
      
      {/* Global Navigation Sidebar */}
      <aside className="z-50 hidden w-[100px] shrink-0 items-start justify-center pt-[28px] xl:flex">
        <div className="ml-[55px] h-[calc(100dvh-56px)]">
          <Sidebar />
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex h-full min-w-0 flex-1 flex-col">
        
        {/* Topbar */}
        <header className="z-40 flex h-[72px] shrink-0 items-center px-3 sm:h-[88px] sm:px-5 lg:h-[110px] lg:px-6">
          <Topbar />
        </header>

        {/* Scrollable Main Content */}
        <main className="min-h-0 flex-1 overflow-y-auto pb-24 scrollbar-hide xl:pb-0">
          <TaskbarCenter />
        </main>

      </div>
    </div>
  );
}

export default Calendar;
