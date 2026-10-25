"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Bell,
  Settings,
  Sparkles,
} from "lucide-react";

function Topbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNotifications = () => {
    router.push("/notifications");
  };

  const handleSettings = () => {
    router.push("/profile");
  };

  return (
    <header className="flex h-[82px] w-full items-center px-0">
      <div className="flex w-full items-center justify-between">
        {/* LEFT SECTION */}
        <div className="flex min-w-0 items-center gap-2">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#3a385c] bg-[#17162f] text-white transition-all hover:bg-[#211f3d]"
            aria-label="Go back"
          >
            <ArrowLeft size={21} strokeWidth={1.8} />
          </button>

          {/* Search */}
          {pathname === "/" && (
            <div className="relative w-[min(360px,40vw)]">
              <Search
                size={18}
                strokeWidth={2}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#66648c]"
              />

              <input
                type="text"
                placeholder="Search tasks, projects, or notes..."
                className="h-10 w-full rounded-full border border-[#55509d] bg-[#17162f] px-4 pr-10 text-xs text-white outline-none placeholder:text-[#626080] focus:border-[#6562c9] focus:ring-1 focus:ring-[#6562c9]"
              />
            </div>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Notifications */}
          <button
            onClick={handleNotifications}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#e7e6f4] transition-colors hover:bg-[#17162f] hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={20} strokeWidth={1.8} />
          </button>

          {/* Settings / Profile */}
          <button
            onClick={handleSettings}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[#e7e6f4] transition-colors hover:bg-[#17162f] hover:text-white"
            aria-label="Open profile settings"
          >
            <Settings size={20} strokeWidth={1.8} />
          </button>

          {/* Calm Mode */}
          <button
            className="flex h-10 cursor-pointer items-center gap-1.5 rounded-full bg-gradient-to-r from-[#5264e8] to-[#6f7df0] px-4 text-sm font-medium text-white shadow-lg shadow-[#5968e8]/20 transition-all hover:opacity-90"
          >
            <Sparkles size={17} strokeWidth={1.8} />
            <span>Calm Mode</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
