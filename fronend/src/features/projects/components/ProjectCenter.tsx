"use client";

import React from "react";
import { Search, Pencil, Plus } from "lucide-react";

const projects = [
  // When there are no projects, make this array empty:
  // {
  //   title: "Mindly UX Case Study",
  //   tasks: "18 of 23 tasks",
  //   updated: "Updated 2h ago",
  //   image: "/projects/portfolio.png",
  //   progress: 78,
  // },
];

function ProjectCenter() {
  const hasProjects = projects.length > 0;

  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#0d0c1f] px-10 py-8 text-white">
      {/* Header */}
      <section>
        <h1 className="text-[25px] font-semibold tracking-tight">
          Projects
        </h1>

        <p className="mt-2 text-[13px] text-[#c5c3d3]">
          Keep every project organized in one place.
        </p>

        {/* Search only when projects exist */}
        {hasProjects && (
          <div className="mt-4 flex h-[38px] w-[250px] items-center rounded-full border border-[#45427c] bg-[#1b1939] px-3">
            <Search
              size={16}
              strokeWidth={2}
              className="mr-2 text-[#aaa7d1]"
            />

            <input
              type="text"
              placeholder="Search tasks, projects or notes..."
              className="w-full bg-transparent text-[11px] text-white outline-none placeholder:text-[#aaa7c5]"
            />
          </div>
        )}
      </section>

      {/* Empty Projects */}
      {!hasProjects ? (
        <section className="flex min-h-[calc(100vh-130px)] flex-col items-center justify-center pb-16">
          {/* Illustration */}
          <div className="mb-4 flex h-[235px] w-[330px] items-center justify-center">
            <img
              src="/images/timeline 1.png"
              alt="No projects"
              className="h-full w-full object-contain"
            />
          </div>

          {/* Empty State Text */}
          <h2 className="text-[24px] font-semibold tracking-tight">
            No projects yet.
          </h2>

          <p className="mt-2 text-center text-[14px] text-[#c5c3d3]">
            Create your first project to keep tasks, files, and ideas together.
          </p>

          {/* New Project Button */}
          <button
            type="button"
            className="mt-5 flex h-[44px] items-center gap-2 rounded-full bg-[#5757ed] px-6 text-[13px] font-medium text-white transition hover:bg-[#6868f5]"
          >
            <Plus size={18} strokeWidth={2} />
            New Project
          </button>
        </section>
      ) : (
        /* Projects List */
        <section className="mt-[60px]">
          <h2 className="text-[20px] font-medium tracking-tight">
            Recent Projects
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.title} {...project} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

type ProjectCardProps = {
  title: string;
  tasks: string;
  updated: string;
  image: string;
  progress: number;
};

function ProjectCard({
  title,
  tasks,
  updated,
  image,
  progress,
}: ProjectCardProps) {
  return (
    <div className="group overflow-hidden rounded-[18px] border border-[#454377] bg-[#25234e] transition duration-200 hover:border-[#6865e9]">
      {/* Project Image */}
      <div className="relative h-[152px] overflow-hidden bg-[#ddd]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />

        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Bottom Content */}
      <div className="flex h-[55px] items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-[25px] w-[25px] shrink-0 items-center justify-center rounded-[5px] bg-[#5757ed]">
            <Pencil size={14} strokeWidth={2.5} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-[14px] font-medium text-white">
              {title}
            </h3>

            <p className="mt-[2px] text-[9px] text-[#c1bfd8]">
              {tasks} • {updated}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="relative ml-3 h-[29px] w-[29px] shrink-0">
          <svg
            width="29"
            height="29"
            viewBox="0 0 29 29"
            className="-rotate-90"
          >
            <circle
              cx="14.5"
              cy="14.5"
              r="11.5"
              fill="none"
              stroke="#a7a5d0"
              strokeWidth="4"
            />

            <circle
              cx="14.5"
              cy="14.5"
              r="11.5"
              fill="none"
              stroke="#5b5bef"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 11.5}`}
              strokeDashoffset={
                2 * Math.PI * 11.5 * (1 - progress / 100)
              }
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default ProjectCenter;