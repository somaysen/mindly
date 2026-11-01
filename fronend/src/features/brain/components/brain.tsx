import BrainSideber from "@/components/Navber/BrainSideber";
import BrainCenter from "./brainCenter";

function Brain() {
  return (
    <div className="min-h-screen w-full overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ">
      {/* Fixed Sidebar */}
      <aside className="fixed left-8 top-5 z-50 hidden h-screen w-[291px] xl:block">
        <BrainSideber />
      </aside>

      {/* Scrollable Brain Center */}
      <main className="h-dvh overflow-y-auto pb-24 xl:ml-[320px] xl:pb-0">
        <div className="min-h-full w-full p-3 pt-5 sm:p-5 lg:p-6">
          <BrainCenter />
        </div>
      </main>
    </div>
  );
}

export default Brain;
