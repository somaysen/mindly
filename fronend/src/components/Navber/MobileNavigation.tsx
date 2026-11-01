"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarBlank,
  ChartDonutIcon,
  CheckSquare,
  Folder,
  House,
  Lightbulb,
  NotePencil,
  Bell,
  UserCircle,
  PuzzlePiece,
} from "@phosphor-icons/react";

const links = [
  { href: "/", label: "Home", icon: House },
  { href: "/brain", label: "Brain", icon: Lightbulb },
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/calendar", label: "Calendar", icon: CalendarBlank },
  { href: "/projects", label: "Projects", icon: Folder },
  { href: "/thoughtSpaces", label: "Spaces", icon: PuzzlePiece },
  { href: "/weeklyReflection", label: "Review", icon: ChartDonutIcon },
  { href: "/notepad", label: "Notes", icon: NotePencil },
  { href: "/notifications", label: "Alerts", icon: Bell },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export default function MobileNavigation() {
  const pathname = usePathname();
  const isAppPage = links.some(({ href }) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href),
  );

  if (!isAppPage) return null;

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-[100] flex items-stretch justify-start overflow-x-auto border-t border-white/10 bg-[#12112a]/95 px-1 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-12px_35px_rgba(0,0,0,0.25)] backdrop-blur-xl xl:hidden"
    >
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex min-w-[48px] flex-1 flex-col items-center justify-center gap-1 rounded-lg py-1 text-[9px] font-medium transition ${active ? "text-[#b7b8ff]" : "text-white/55 hover:text-white"}`}
          >
            <Icon size={21} weight={active ? "fill" : "regular"} aria-hidden="true" />
            <span className="max-w-full truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
