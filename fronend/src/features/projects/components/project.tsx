import Topbar from "@/features/dashboard/components/Topbar";
import Sidebar from "@/components/Navber/Sidebar";
import ProjectCenter from "./ProjectCenter";

function projects() {
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
        <header className="h-[110px] shrink-0 px-6 flex items-center z-40">
          <Topbar />
        </header>

        {/* Scrollable Main Content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <ProjectCenter />
        </main>
      </div>
    </div>
  );
}

export default projects;
