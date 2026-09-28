import Topbar from "@/features/dashboard/components/Topbar";
import Sidebar from "@/components/Navber/Sidebar";
import WeeklyReflectionCenter from "./WeeklyReflectionCenter";

function WeeklyReflection() {
  return (
    <div className="flex h-screen w-full absolute overflow-hidden bg-[#0d0c1f]">
      {/* Global Navigation Sidebar */}
      <aside className="w-[100px] shrink-0 z-50 flex items-start justify-center pt-[28px]">
        <div className="h-[calc(113vh-160px)] ml-[55px]">
          <Sidebar />
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 h-screen">
        {/* Topbar */}
        <header className="h-[112px] shrink-0 px-6 flex items-center ml-5 z-40">
          <Topbar />
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 ml-12 pr-5 overflow-y-auto scrollbar-hide">
          <WeeklyReflectionCenter />
        </main>
      </div>
    </div>
  );
}

export default WeeklyReflection;
