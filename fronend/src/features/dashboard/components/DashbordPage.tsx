import Topbar from "@/components/Navber/Topbar";
import DashboardSidebar from "./DashboradSidbar";
import DashbordCenter from "./DashbordCenter";

function TasksPage() {
  return (
    <div className="h-screen w-full overflow-hidden bg-[#0d0c1f]">
      <aside className="fixed left-8 top-5 z-50 h-screen w-[260px]">
        <DashboardSidebar />
      </aside>

      {/* Main Area */}
      <div className="ml-[260px] W-[50%] h-screen">
        {/* Fixed Topbar */}
        <div className="fixed left-[350px] right-5 top-2 z-50">
          <Topbar />
        </div>

        {/* Scrollable Content */}
        <main className="h-screen ml-[90px] mr-[18px]  right-10  overflow-y-auto pt-[130px] scrollbar-hide">
          <DashbordCenter />
        </main>
      </div>
    </div>
  );
}

export default TasksPage;
