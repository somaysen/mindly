"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

import Sidebar from "@/components/Navber/Sidebar";

import {
  House,
  SunDim,
  Star,
  ClockClockwise,
} from "@phosphor-icons/react";

const views = [
  {
    href: "/",
    label: "All Tasks",
    icon: House,
  },
  {
    href: "/today",
    label: "Today",
    icon: SunDim,
  },
  {
    href: "/upcoming",
    label: "Important",
    icon: Star,
  },
  {
    href: "/completed",
    label: "Upcoming",
    icon: ClockClockwise,
  },
];

const projects = [
  {
    href: "/projects/design-class",
    label: "Design class",
    color: "bg-[#f7b26a]",
  },
  {
    href: "/projects/internship-prep",
    label: "Internship prep",
    color: "bg-[#93d7c7]",
  },
  {
    href: "/projects/personal",
    label: "Personal",
    color: "bg-[#f5d970]",
  },
];

export default function taskSidebar() {
  const pathname = usePathname();

  return (
    <main
      className="
        sticky
        top-[20px]
        z-40
        self-start
        flex
        h-[calc(100vh-40px)]
        w-[290px]
        items-stretch
        gap-[1px]
        overflow-hidden
        rounded-[24px]
        bg-[#1A1840]
        p-[10px]
        shadow-[0_18px_45px_rgba(12,10,35,0.35)]
      "
    >
      {/* Left Sidebar */}
      <div className="h-full w-[74px] shrink-0">
        <Sidebar />
      </div>

      {/* Right Sidebar */}
      <aside
        className="
          h-full
          w-[196px]
          shrink-0
          rounded-[16px]
          bg-[#19173f]
          px-[5px]
          py-[28px]
          text-white
        "
      >
        {/* Views */}
        <section className="flex flex-col">
          <p
            className="
              mb-[16px]
              text-[12px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-white/40
            "
          >
            Views
          </p>

          <nav className="flex flex-col gap-[7px]">
            {views.map((item) => {
              const Icon = item.icon;

              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    `
                    flex
                    h-[38px]
                    w-full
                    items-center
                    gap-[5px]
                    rounded-[10px]
                    px-[10px]
                    text-[15px]
                    font-medium
                    transition-all
                    duration-200
                    `,
                    isActive
                      ? "bg-[#c8caf8] text-[#4f53d9]"
                      : "text-white/85 hover:bg-white/5 hover:text-white",
                  ].join(" ")}
                >
                  <Icon
                    size={18}
                    weight={isActive ? "bold" : "regular"}
                  />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </section>

        {/* Projects */}
        <section className="mt-[34px]">
          <p
            className="
              mb-[16px]
              px-[8px]
              text-[11px]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-white/40
            "
          >
            Projects
          </p>

          <div className="flex flex-col gap-[15px]">
            {projects.map((project) => (
              <Link
                key={project.href}
                href={project.href}
                className="
                  flex
                  items-center
                  gap-[10px]
                  px-[9px]
                  text-[18px]
                  font-normal
                  tracking-wide
                  text-white/85
                  transition
                  hover:text-white
                "
              >
                <span
                  className={`
                    h-[10px]
                    w-[10px]
                    shrink-0
                    rounded-full
                    ${project.color}
                  `}
                />

                <span className="truncate">
                  {project.label}
                </span>
              </Link>
            ))}

            {/* Add Project */}
            <button
              type="button"
              className="
                flex
                items-center
                gap-[10px]
                px-[8px]
                text-[16px]
                font-medium
                text-white/45
                transition
                hover:text-white/80
              "
            >
              <Plus size={18} strokeWidth={1.8} />

              <span>Add Project</span>
            </button>
          </div>
        </section>
      </aside>
    </main>
  );
}
