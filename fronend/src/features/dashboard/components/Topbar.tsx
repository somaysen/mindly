"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Bell,
  Settings,
  Sparkles,
} from "lucide-react";

function Topbar() {
  const router = useRouter();

  return (
    <header className="flex h-[82px] w-full items-center px-1 sm:px-0">
      <div className="flex w-full items-center justify-between gap-4">

        {/* Left Section */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#3a385c] bg-[#17162f] text-[#ffffff] transition-all hover:bg-[#211f3d] hover:text-white"
          >
            <ArrowLeft size={22} strokeWidth={1.8} />
          </button>

          {/* Search */}
          <div className="relative w-[min(400px,48vw)]">
            <Search
              size={20}
              strokeWidth={2.0}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#66648c]"
            />

            <input
              type="text"
              placeholder="Search tasks, projects, or notes..."
              className="h-10 w-full rounded-full border border-[#55509d] bg-[#17162f] px-4 pr-11 text-xs text-white placeholder:text-[#626080] outline-none transition-all focus:border-[#6562c9] focus:ring-1 focus:ring-[#6562c9] sm:h-11 sm:text-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-4 sm:gap-7">
          {/* Notification */}
          <button
            className="text-[#e7e6f4] hover:text-white transition-colors"
            aria-label="Notifications"
          >
            <Bell size={22} strokeWidth={1.8} />
          </button>

          {/* Settings */}
          <button
            className="text-[#e7e6f4] hover:text-white transition-colors"
            aria-label="Settings"
          >
            <Settings size={22} strokeWidth={1.8} />
          </button>

          {/* Calm Mode */}
          <button className="flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#5264e8] to-[#6f7df0] px-3 text-sm font-medium text-white shadow-lg shadow-[#5968e8]/20 transition-all hover:opacity-90 sm:h-11 sm:px-5">
            <Sparkles size={20} strokeWidth={1.8} />
            <span className="hidden sm:inline">Calm Mode</span>
          </button>
        </div>

      </div>
    </header>
  );
}

export default Topbar;