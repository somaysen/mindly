import BrainSideber from "@/components/Navber/BrainSideber";
import BrainCenter from "./brainCenter";

function Brain() {
  return (
    <div className="min-h-screen w-full overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ">
      {/* Fixed Sidebar */}
      <aside className="fixed left-8 top-5 z-50 h-screen w-[260px]">
        <BrainSideber />
      </aside>

      {/* Scrollable Brain Center */}
      <main className="ml-[320px] h-screen overflow-y-auto">
        <div className="min-h-full w-full p-4 sm:p-5 lg:p-6">
          <BrainCenter />
        </div>
      </main>
    </div>
  );
}

export default Brain;