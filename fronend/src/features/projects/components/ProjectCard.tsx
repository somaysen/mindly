"use client";

import React from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";

type ProjectCardProps = {
  projectId?: string;
  title: string;
  tasks: string;
  updated: string;
  image: string;
  progress: number;
};

function ProjectCard({
  projectId,
  title,
  tasks,
  updated,
  image,
  progress,
}: ProjectCardProps) {
  const card = (
    <div className="group overflow-hidden rounded-[18px] border border-[#454377] bg-[#25234e] transition duration-200 hover:border-[#6865e9]">
      {/* Project Image */}
      <div className="relative h-38 overflow-hidden bg-[#ddd]">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Bottom Content */}
      <div className="flex h-13.75 items-center justify-between px-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-6.25 w-6.25 shrink-0 items-center justify-center rounded-[5px] bg-[#5757ed]">
            <Pencil size={14} strokeWidth={2.5} />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-[14px] font-medium text-white">
              {title}
            </h3>
            <p className="mt-0.5 text-[9px] text-[#c1bfd8]">
              {tasks} • {updated}
            </p>
          </div>
        </div>

        <div className="relative ml-3 h-7.25 w-7.25 shrink-0">
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

  return projectId ? (
    <Link
      href={`/projects/details/${encodeURIComponent(projectId)}`}
      aria-label={`View ${title} details`}
      className="block rounded-[18px] outline-none focus-visible:ring-2 focus-visible:ring-[#8585ff]"
    >
      {card}
    </Link>
  ) : card;
}

export default ProjectCard;
