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

  const { mutate: logout, isPending } = useLogOut();

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
    <header className="flex h-[82px] w-full items-center px-0">
      <div className="flex w-full items-center justify-between">
        {/* LEFT SECTION */}
        <div className="flex min-w-0 items-center gap-2">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="
              flex h-10 w-10 shrink-0
              items-center justify-center
              rounded-full
              border border-[#3a385c]
              bg-[#17162f]
              text-white
              transition-all
              hover:bg-[#211f3d]
            "
          >
            <ArrowLeft size={21} strokeWidth={1.8} />
          </button>

          {/* Search */}
          <div className="relative w-[min(360px,40vw)]">
            <Search
              size={18}
              strokeWidth={2}
              className="
                absolute right-3.5 top-1/2
                -translate-y-1/2
                text-[#66648c]
              "
            />

            <input
              type="text"
              placeholder="Search tasks, projects, or notes..."
              className="
                h-10 w-full
                rounded-full
                border border-[#55509d]
                bg-[#17162f]
                px-4 pr-10
                text-xs text-white
                outline-none
                placeholder:text-[#626080]
                focus:border-[#6562c9]
                focus:ring-1
                focus:ring-[#6562c9]
              "
            />
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Notification */}
          <button
            className="
              flex h-9 w-9
              items-center justify-center
              rounded-full
              text-[#e7e6f4]
              transition-colors
              hover:bg-[#17162f]
              hover:text-white
            "
            aria-label="Notifications"
          >
            <Bell size={20} strokeWidth={1.8} />
          </button>

          {/* Settings */}
          <div ref={settingsRef} className="relative">
            <button
              onClick={() => setIsSettingsOpen((prev) => !prev)}
              className={`
                flex h-9 w-9
                items-center justify-center
                rounded-full
                text-[#e7e6f4]
                transition-colors
                hover:bg-[#17162f]
                hover:text-white
                ${isSettingsOpen ? "bg-[#17162f] text-white" : ""}
              `}
              aria-label="Settings"
              aria-expanded={isSettingsOpen}
            >
              <Settings size={20} strokeWidth={1.8} />
            </button>

            {/* Dropdown */}
            {isSettingsOpen && (
              <div
                className="
                  absolute right-0 top-11 z-50
                  w-48
                  overflow-hidden
                  rounded-2xl
                  border border-[#39375b]
                  bg-[#17162f]
                  p-2
                  shadow-2xl
                  shadow-black/40
                "
              >
                {/* Profile */}
                <button
                  onClick={handleProfile}
                  className="
                    flex w-full
                    items-center gap-2.5
                    rounded-xl
                    px-3 py-2.5
                    text-left text-sm
                    text-[#e7e6f4]
                    transition-colors
                    hover:bg-[#252344]
                    hover:text-white
                  "
                >
                  <User size={17} strokeWidth={1.8} />
                  <span>Profile</span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  disabled={isPending}
                  className="
                    flex w-full
                    items-center gap-2.5
                    rounded-xl
                    px-3 py-2.5
                    text-left text-sm
                    text-[#e7e6f4]
                    transition-colors
                    hover:bg-[#252344]
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <LogOut size={17} strokeWidth={1.8} />

                  <span>{isPending ? "Logging out..." : "Logout"}</span>
                </button>
              </div>
            )}
          </div>

          {/* Calm Mode */}
          <button
            className="
              flex h-10
              items-center gap-1.5
              rounded-full
              bg-gradient-to-r
              from-[#5264e8]
              to-[#6f7df0]
              px-4
              text-sm
              font-medium
              text-white
              shadow-lg
              shadow-[#5968e8]/20
              transition-all
              hover:opacity-90
            "
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
