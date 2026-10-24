"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { House, Sun, Moon, Check, Plus } from "lucide-react";
import Sidebar from "@/components/Navber/Sidebar";
import { useGetProjects } from "@/features/projects/hooks/useProject";

interface ApiProject {
  id?: string | number;
  projectId?: string | number;
  projectID?: string | number;
  project_id?: string | number;
  _id?: string | number;
  name?: string;
  projectName?: string;
  projectTitle?: string;
  title?: string;
}

interface ProjectLink {
  id: string;
  name: string;
}

function getProjects(response: unknown, depth = 0): ApiProject[] {
  if (depth > 5 || !response) return [];
  if (Array.isArray(response)) return response as ApiProject[];
  if (typeof response !== "object") return [];

  const record = response as Record<string, unknown>;
  for (const key of ["data", "projects", "projectList", "items", "result"]) {
    const projects = getProjects(record[key], depth + 1);
    if (projects.length > 0) return projects;
  }
  return [];
}

function toProjectLink(project: ApiProject): ProjectLink | null {
  const id = project.id ?? project.projectId ?? project.projectID ?? project.project_id ?? project._id;
  const name = project.projectName ?? project.projectTitle ?? project.name ?? project.title;
  if (id == null || typeof name !== "string" || !name.trim()) return null;
  return { id: String(id), name: name.trim() };
}

const projectColors = [
  "bg-[#f7b26a]",
  "bg-[#93d7c7]",
  "bg-[#f5d970]",
  "bg-[#9a9cff]",
  "bg-[#ee8ec6]",
];

const views = [
  {
    href: "/",
    label: "Home",
    icon: House,
  },
  {
    href: "/today",
    label: "Today",
    icon: Sun,
  },
  {
    href: "/upcoming",
    label: "Upcoming",
    icon: Moon,
  },
  {
    href: "/completed",
    label: "Completed",
    icon: Check,
  },
];


export default function DashboardSidebar() {
  const pathname = usePathname();
  const { data: projectData, isLoading, isError } = useGetProjects();
  const projects = useMemo(
    () => getProjects(projectData).map(toProjectLink).filter((project): project is ProjectLink => project !== null),
    [projectData],
  );

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
                  <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />

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
            {isLoading && <p className="px-[9px] text-xs text-white/40">Loading projects...</p>}
            {isError && <p role="alert" className="px-[9px] text-xs text-rose-300">Could not load projects.</p>}
            {!isLoading && !isError && projects.length === 0 && <p className="px-[9px] text-xs text-white/40">No projects yet.</p>}
            {projects.map((project, index) => {
              const href = `/projects/details/${encodeURIComponent(project.id)}`;
              const isActive = pathname.startsWith(href);

              return (
                <Link
                  key={project.id}
                  href={href}
                  title={project.name}
                  className={`flex items-center gap-[10px] rounded-lg px-[9px] text-[14px] font-normal tracking-wide transition hover:text-white ${isActive ? "text-white" : "text-white/75"}`}
                >
                  <span className={`h-[10px] w-[10px] shrink-0 rounded-full ${projectColors[index % projectColors.length]}`} />
                  <span className="truncate">{project.name}</span>
                </Link>
              );
            })}

            {/* Add Project */}
            <Link
              href="/projects?create=1"
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
            </Link>
          </div>
        </section>
      </aside>
    </main>
  );
}
