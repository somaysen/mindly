"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Folder,
  Plus,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import {
  useGetProjects,
} from "@/features/projects/hooks/useProject";
import { useGetProjectDetails } from "@/features/ProjectDetails/hooks/useProjectDetails";
import FileSection from "@/features/ProjectDetails/components/fileSection";
import { getApiErrorMessage } from "@/lib/apiError";

type ProjectDetailsRecord = {
  id?: string | number;
  projectId?: string | number;
  projectID?: string | number;
  project_id?: string | number;
  _id?: string | number;
  name?: string;
  projectName?: string;
  projectTitle?: string;
  title?: string;
  description?: string;
  taskCount?: number;
  tasksCount?: number;
  completedTaskCount?: number;
  completedTasks?: number;
  createdAt?: string;
  updatedAt?: string;
  data?: unknown;
  project?: unknown;
  result?: unknown;
  item?: unknown;
};

function getProject(
  response: unknown,
  depth = 0
): ProjectDetailsRecord | null {
  if (depth > 5 || !response || typeof response !== "object") {
    return null;
  }

  const record = response as ProjectDetailsRecord;

  if (
    record.name ||
    record.projectName ||
    record.projectTitle ||
    record.title ||
    record.description ||
    record.id ||
    record.projectId ||
    record.projectID ||
    record._id
  ) {
    return record;
  }

  return (
    getProject(record.data, depth + 1) ??
    getProject(record.project, depth + 1) ??
    getProject(record.result, depth + 1) ??
    getProject(record.item, depth + 1)
  );
}

function getProjectList(
  response: unknown,
  depth = 0
): ProjectDetailsRecord[] {
  if (depth > 5) return [];
  if (Array.isArray(response)) {
    return response as ProjectDetailsRecord[];
  }
  if (!response || typeof response !== "object") return [];

  const record = response as Record<string, unknown>;

  for (const key of [
    "data",
    "projects",
    "projectList",
    "items",
    "result",
  ]) {
    const projects = getProjectList(record[key], depth + 1);
    if (projects.length > 0) return projects;
  }

  return [];
}

function getProjectId(project: ProjectDetailsRecord) {
  return String(
    project.id ??
      project.projectId ??
      project.projectID ??
      project.project_id ??
      project._id ??
      ""
  );
}

export default function ProjectDetailsCenter({
  projectId,
}: {
  projectId: string;
}) {
  const { data, isLoading, isError, error, refetch } =
    useGetProjectDetails(projectId);

  const projectListQuery = useGetProjects();
  const [open, setOpen] = useState(false);
  const [fileOpenRequest, setFileOpenRequest] = useState(0);

  const project =
    getProject(data) ??
    getProjectList(projectListQuery.data).find(
      (item) => getProjectId(item) === projectId
    ) ??
    null;

  if (isLoading || (!project && projectListQuery.isLoading)) {
    return (
      <main
        className="flex min-h-[calc(100vh-110px)] items-center justify-center px-6 text-sm text-[#c5c3d3]"
        role="status"
      >
        Loading project...
      </main>
    );
  }

  if (!project) {
    return (
      <main className="flex min-h-[calc(100vh-110px)] flex-col items-center justify-center px-6 text-center text-white">
        <h1 className="text-xl font-semibold">
          Couldn’t load this project
        </h1>

        <p className="mt-2 max-w-lg text-sm text-[#c5c3d3]">
          {isError
            ? getApiErrorMessage(error)
            : "The project details were not found."}
        </p>

        {isError && (
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 rounded-full border border-[#45427c] px-5 py-2 text-sm transition hover:bg-white/5"
          >
            Try again
          </button>
        )}

        <Link
          href="/projects"
          className="mt-5 inline-flex items-center gap-2 text-sm text-[#aaa7c5] transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
      </main>
    );
  }

  const title =
    project.projectName ??
    project.projectTitle ??
    project.name ??
    project.title ??
    "Untitled project";

  const taskCount = project.taskCount ?? project.tasksCount ?? 0;
  const completedTaskCount =
    project.completedTaskCount ?? project.completedTasks ?? 0;

  const progress =
    taskCount > 0
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round((completedTaskCount / taskCount) * 100)
          )
        )
      : 0;

  const dateValue = project.updatedAt ?? project.createdAt;
  const date = dateValue ? new Date(dateValue) : null;

  return (
    <main className="min-h-[calc(100vh-110px)] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] xl:gap-8">
        {/* Project details and files */}
        <div className="flex min-w-0 flex-col gap-8">
          <section className="rounded-2xl border border-[#292750] bg-[#222147] p-5 sm:p-6">
            <h1 className="break-words text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h1>

            <p className="mt-3 text-sm text-[#9999f5] sm:text-base">
              {date && !Number.isNaN(date.getTime())
                ? `Updated ${date.toLocaleDateString()}`
                : "Project details"}
            </p>

            <div className="mt-7">
              <h2 className="text-base font-medium">Overview</h2>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#e1dff2]">
                {project.description?.trim() ||
                  "No description has been added to this project yet."}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="mb-2 text-base font-medium">
                Progress Summary
              </h2>

              <div className="rounded-xl border border-[#353360] bg-[#1b1a40] p-4 sm:p-5">
                <p className="text-sm font-medium text-[#a5a5ff]">
                  {completedTaskCount} of {taskCount} tasks completed
                </p>

                <div
                  className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#cecdf9]"
                  role="progressbar"
                  aria-label="Project progress"
                  aria-valuenow={progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#5757ed] to-[#9999ff] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Files section merged into this component */}
          <section className="rounded-2xl border border-[#292750] bg-[#222147] p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-medium">Files</h2>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpen((previous) => !previous)}
                  aria-label="Add file"
                  aria-expanded={open}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#46436e] text-[#aaa7ff] transition hover:bg-[#353260]"
                >
                  <Plus
                    size={20}
                    className={`transition-transform ${
                      open ? "rotate-45" : ""
                    }`}
                  />
                </button>

                {open && (
                  <div className="absolute right-0 top-11 z-50 w-48 rounded-xl border border-[#39365f] bg-[#19182f] p-1.5 shadow-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        setFileOpenRequest((request) => request + 1);
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-200 transition hover:bg-[#302e55]"
                    >
                      <FileText
                        size={17}
                        className="text-[#aaa7ff]"
                      />
                      Add Text File
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        console.log("Add Illustrator");
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-200 transition hover:bg-[#302e55]"
                    >
                      <ImageIcon
                        size={17}
                        className="text-orange-300"
                      />
                      Add Illustrator
                    </button>
                  </div>
                )}
              </div>
            </div>

            <FileSection
              projectId={projectId}
              embedded
              openRequest={fileOpenRequest}
            />
          </section>
        </div>

        {/* Tasks section */}
        <section className="min-w-0">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Tasks</h2>
          </div>

          <div className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-[#393566] bg-[#1b1a38] p-6 text-center">
            <Folder size={28} className="text-[#8585ff]" />

            <p className="mt-3 text-sm text-[#c5c3e2]">
              {taskCount > 0
                ? `${taskCount} tasks are linked to this project.`
                : "No tasks added to this project yet."}
            </p>
          </div>

          <Link
            href="/projects"
            className="mt-6 inline-flex items-center gap-2 text-sm text-[#aaa7c5] transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </section>
      </div>
    </main>
  );
}
