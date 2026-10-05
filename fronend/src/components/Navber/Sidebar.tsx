"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  House,
  Lightbulb,
  CheckSquare,
  CalendarBlank,
  Folder,
  PuzzlePiece,
  ChartDonutIcon,
} from "@phosphor-icons/react";

import ProfileModal from "./ProfileModel";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: House,
  },
  {
    href: "/brain",
    label: "Brain",
    icon: Lightbulb,
  },
  {
    href: "/tasks",
    label: "Tasks",
    icon: CheckSquare,
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: CalendarBlank,
  },
  {
    href: "/projects",
    label: "Projects",
    icon: Folder,
  },
  {
    href: "/thoughtSpaces",
    label: "Thought Spaces",
    icon: PuzzlePiece,
  },
  {
    href: "/weeklyReflection",
    label: "Weekly Reflection",
    icon: ChartDonutIcon,
  },
];

const avatars = [
  "/Avatar/Asset 32.png",
  "/Avatar/Asset 33.png",
  "/Avatar/Asset 34.png",
  "/Avatar/Asset 35.png",
  "/Avatar/Asset 36.png",
  "/Avatar/Asset 37.png",
  "/Avatar/Asset 39 (1).png",
  "/Avatar/Asset 32.png",
  "/Avatar/Asset 40.png",
  "/Avatar/Asset 41.png",
  "/Avatar/Asset 42.png",
  "/Avatar/Frame 904.png",
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[74px] flex-col items-center justify-start">
      {/* Logo */}
      <Link
        href="/"
        className="
          mb-[12px]
          flex
          h-[54px]
          w-[54px]
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white
          shadow-[0_8px_20px_rgba(21,14,64,0.25)]
        "
      >
        <img
          src="/images/Frame 76.png"
          alt="Logo"
          className="h-[50px] w-[50px] object-contain"
        />
      </Link>

      {/* Navigation */}
      <nav
        className="
          flex
          w-[62px]
          flex-1
          flex-col
          items-center
          rounded-full
          bg-[#4d57dd]
          py-[14px]
          shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]
        "
      >
        <div className="flex flex-col items-center gap-[10px] pt-[30px]">
          {navItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className="
                  group
                  relative
                  flex
                  h-[45px]
                  w-[45px]
                  items-center
                  justify-center
                  rounded-[14px]
                  text-white
                  transition-all
                  duration-200
                "
              >
                {isActive && (
                  <span
                    className="
                      absolute
                      -left-[10px]
                      top-1/2
                      h-[35px]
                      w-[4px]
                      -translate-y-1/2
                      rounded-full
                      bg-white
                    "
                  />
                )}

                <Icon
                  size={27}
                  weight={isActive ? "fill" : "regular"}
                  className="
                    transition-transform
                    duration-200
                    group-hover:scale-105
                  "
                />
              </Link>
            );
          })}
        </div>

        {/* Profile */}
        <div className="mt-auto flex items-center justify-center pb-[50px] pt-[10px]">
          <ProfileModal avatars={avatars} />
        </div>
      </nav>
    </aside>
  );
}