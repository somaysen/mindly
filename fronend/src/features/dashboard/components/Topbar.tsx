"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Bell,
  Settings,
  Sparkles,
  User,
  LogOut,
} from "lucide-react";

import { useLogOut } from "@/features/auth/hooks/useAuthApi";

function Topbar() {
  const router = useRouter();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  // Logout hook
  const { mutate: logout, isPending } = useLogOut();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setIsSettingsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfile = () => {
    setIsSettingsOpen(false);
    router.push("/profile");
  };

  const handleLogout = () => {
    setIsSettingsOpen(false);

    logout(undefined, {
      onSuccess: () => {
        router.push("/login");
      },
      onError: (error) => {
        console.error("Logout failed:", error);
      },
    });
  };

  return (
    <header className="flex h-[82px] w-full items-center px-1 sm:px-0">
      <div className="flex w-full items-center justify-between gap-4">

        {/* Left Section */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">

          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#3a385c] bg-[#17162f] text-white transition-all hover:bg-[#211f3d]"
          >
            <ArrowLeft size={22} strokeWidth={1.8} />
          </button>

          {/* Search */}
          <div className="relative w-[min(400px,48vw)]">
            <Search
              size={20}
              strokeWidth={2}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#66648c]"
            />

            <input
              type="text"
              placeholder="Search tasks, projects, or notes..."
              className="h-10 w-full rounded-full border border-[#55509d] bg-[#17162f] px-4 pr-11 text-xs text-white outline-none transition-all placeholder:text-[#626080] focus:border-[#6562c9] focus:ring-1 focus:ring-[#6562c9] sm:h-11 sm:text-sm"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex shrink-0 items-center gap-4 sm:gap-7">

          {/* Notification */}
          <button
            className="text-[#e7e6f4] transition-colors hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={22} strokeWidth={1.8} />
          </button>

          {/* Settings */}
          <div ref={settingsRef} className="relative">
            <button
              onClick={() => setIsSettingsOpen((prev) => !prev)}
              className={`cursor-pointer text-[#e7e6f4] transition-colors hover:text-white ${
                isSettingsOpen ? "text-white" : ""
              }`}
              aria-label="Settings"
              aria-expanded={isSettingsOpen}
            >
              <Settings size={22} strokeWidth={1.8} />
            </button>

            {/* Dropdown */}
            {isSettingsOpen && (
              <div className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-2xl border border-[#39375b] bg-[#17162f] p-2 shadow-2xl shadow-black/40">

                {/* Profile */}
                <button
                  onClick={handleProfile}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-[#e7e6f4] transition-colors hover:bg-[#252344] hover:text-white"
                >
                  <User size={18} strokeWidth={1.8} />
                  <span>Profile</span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  disabled={isPending}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-[#e7e6f4] transition-colors hover:bg-[#252344] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <LogOut size={18} strokeWidth={1.8} />

                  <span>
                    {isPending ? "Logging out..." : "Logout"}
                  </span>
                </button>
              </div>
            )}
          </div>

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