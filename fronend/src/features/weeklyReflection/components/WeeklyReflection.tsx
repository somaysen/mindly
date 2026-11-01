import Topbar from "@/components/Navber/Topbar";
import Sidebar from "@/components/Navber/Sidebar";
import WeeklyReflectionCenter from "./WeeklyReflectionCenter";

function WeeklyReflection() {
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
        <header className="z-40 flex h-[72px] shrink-0 items-center px-3 sm:h-[88px] sm:px-5 lg:h-[112px] lg:px-6 lg:pl-11">
          <Topbar />
        </header>

        {/* Scrollable Main Content */}
        <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-24 scrollbar-hide xl:px-0 xl:pb-0 xl:pl-12 xl:pr-5">
          <WeeklyReflectionCenter />
        </main>
      </div>
    </div>
  );
}

export default WeeklyReflection;
