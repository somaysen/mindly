"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import ProjectCard from "./ProjectCard";
import CreateProjectModal, { type ProjectFormData } from "./CreateProjectModal";
import {
  useCreateProject,
  useGetProjects,
} from "@/features/projects/hooks/useProject";
import { getApiErrorMessage } from "@/lib/apiError";

type ProjectRecord = {
  id: string;
  title: string;
  tasks: string;
  updated: string;
  image: string;
  progress: number;
};

type ApiProject = {
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
  updatedAt?: string;
  createdAt?: string;
};

function getProjectList(response: unknown, depth = 0): ApiProject[] {
  if (depth > 5) return [];
  if (Array.isArray(response)) return response as ApiProject[];
  if (!response || typeof response !== "object") return [];

  const result = response as Record<string, unknown>;
  for (const key of ["data", "projects", "projectList", "items", "result"]) {
    const projects = getProjectList(result[key], depth + 1);
    if (projects.length > 0) return projects;
  }

  return [];
}

function toProjectRecord(project: ApiProject): ProjectRecord {
  const taskCount = project.taskCount ?? project.tasksCount ?? 0;
  const completedTaskCount =
    project.completedTaskCount ?? project.completedTasks ?? 0;
  const progress =
    taskCount > 0 ? Math.round((completedTaskCount / taskCount) * 100) : 0;
  const updatedAt = project.updatedAt ?? project.createdAt;
  const updatedDate = updatedAt ? new Date(updatedAt) : null;

  return {
    id: String(project.id ?? project.projectId ?? project.projectID ?? project.project_id ?? project._id ?? ""),
    title:
      project.projectName ??
      project.projectTitle ??
      project.name ??
      project.title ??
      "Untitled project",
    tasks: `${taskCount} ${taskCount === 1 ? "task" : "tasks"}`,
    updated:
      updatedDate && !Number.isNaN(updatedDate.getTime())
        ? `Updated ${updatedDate.toLocaleDateString()}`
        : "Recently created",
    image: "/images/timeline 1.png",
    progress: Math.max(0, Math.min(progress, 100)),
  };
}

function getCreatedProjectId(response: unknown): string | null {
  if (!response || typeof response !== "object") return null;
  const record = response as {
    id?: string | number;
    projectId?: string | number;
    projectID?: string | number;
    project_id?: string | number;
    _id?: string | number;
    data?: unknown;
    project?: unknown;
    result?: unknown;
  };

  const id = record.id ?? record.projectId ?? record.projectID ?? record.project_id ?? record._id;
  if (id !== undefined && id !== null && String(id).length > 0)
    return String(id);
  return (
    getCreatedProjectId(record.data) ??
    getCreatedProjectId(record.project) ??
    getCreatedProjectId(record.result)
  );
}

function ProjectCenter() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data, isLoading, isError, error, refetch } = useGetProjects();
  const createProject = useCreateProject();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("create") !== "1") return;

    setIsModalOpen(true);
    router.replace("/projects", { scroll: false });
  }, [router]);

  const projects = useMemo(
    () => getProjectList(data).map((project) => toProjectRecord(project)),
    [data],
  );
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const handleCreateProject = async (project: ProjectFormData) => {
    const formData = new FormData();
    formData.append("projectName", project.name);
    formData.append("description", project.description);
    formData.append("useTasks", String(project.useTasks));
    formData.append("useIdeas", String(project.useIdeas));

    try {
      const response = await createProject.mutateAsync(formData);
      setIsModalOpen(false);
      let projectId = getCreatedProjectId(response);

      if (!projectId) {
        const refreshedProjects = await refetch();
        const createdProject = getProjectList(refreshedProjects.data).find(
          (item) =>
            (item.projectName ?? item.projectTitle ?? item.name ?? item.title)?.trim() ===
            project.name,
        );
        projectId =
          createdProject?.id || createdProject?.projectId || createdProject?.projectID || createdProject?.project_id || createdProject?._id
            ? String(createdProject.id ?? createdProject.projectId ?? createdProject.projectID ?? createdProject.project_id ?? createdProject._id)
            : null;
      }

      if (projectId) {
        router.push(`/projects/details/${encodeURIComponent(projectId)}`);
      }
    } catch (error) {
      // The mutation error is shown below and the modal keeps its values for retry.
      throw error;
    }
  };

  const showEmptyState = !isLoading && !isError && projects.length === 0;

  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#0d0c1f] px-6 py-8 text-white md:px-10">
      <section>
        <h1 className="text-[25px] font-semibold tracking-tight">Projects</h1>
        <p className="mt-2 text-[13px] text-[#c5c3d3]">
          Keep every project organized in one place.
        </p>

        {projects.length > 0 && !isError && (
          <div className="mt-4 flex h-[40px] w-full max-w-[320px] items-center rounded-full border border-[#45427c] bg-[#1b1939] px-3">
            <Search size={16} className="mr-2 shrink-0 text-[#aaa7d1]" />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search projects..."
              aria-label="Search projects"
              className="w-full bg-transparent text-[12px] text-white outline-none placeholder:text-[#aaa7c5]"
            />
          </div>
        )}
      </section>

      {createProject.isError && (
        <p className="mt-4 text-sm text-red-300" role="alert">
          Couldn’t create the project. {getApiErrorMessage(createProject.error)}
        </p>
      )}

      {isLoading ? (
        <section
          className="flex min-h-[calc(100vh-180px)] items-center justify-center text-sm text-[#c5c3d3]"
          role="status"
        >
          Loading projects...
        </section>
      ) : isError ? (
        <section className="flex min-h-[calc(100vh-180px)] flex-col items-center justify-center text-center">
          <p className="text-sm text-red-300">
            Couldn’t load projects. {getApiErrorMessage(error)}
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="mt-4 rounded-full border border-[#45427c] px-5 py-2 text-sm transition hover:bg-white/5"
          >
            Try again
          </button>
        </section>
      ) : showEmptyState ? (
        <section className="flex min-h-[calc(100vh-180px)] flex-col items-center justify-center pb-16">
          <div className="mb-4 flex h-[235px] w-full max-w-[330px] items-center justify-center">
            <img
              src="/images/timeline 1.png"
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
          <h2 className="text-[24px] font-semibold tracking-tight">
            No projects yet.
          </h2>
          <p className="mt-2 max-w-[420px] text-center text-[14px] text-[#c5c3d3]">
            Create your first project to keep tasks, files, and ideas together.
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="mt-5 flex h-[44px] items-center gap-2 rounded-full bg-[#5757ed] px-6 text-[13px] font-medium transition hover:bg-[#6868f5]"
          >
            <Plus size={18} />
            New Project
          </button>
        </section>
      ) : (
        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[20px] font-medium tracking-tight">
              Recent Projects
            </h2>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex h-[40px] items-center gap-2 rounded-full bg-[#5757ed] px-5 text-[13px] font-medium transition hover:bg-[#6868f5]"
            >
              <Plus size={17} />
              New Project
            </button>
          </div>

          {filteredProjects.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project, index) => (
                <ProjectCard
                  key={project.id || `${project.title}-${index}`}
                  projectId={project.id}
                  {...project}
                />
              ))}
            </div>
          ) : (
            <p className="mt-8 text-center text-sm text-[#aaa7c5]">
              No projects match your search.
            </p>
          )}
        </section>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateProject}
        isSubmitting={createProject.isPending}
      />
    </main>
  );
}

export default ProjectCenter;
