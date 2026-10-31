export interface ProjectPayload {
  projectName: string;
  description: string;
  useTasks: boolean;
  useIdeas: boolean;
}

export interface Project {
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
  useTasks?: boolean;
  useIdeas?: boolean;
  taskCount?: number;
  tasksCount?: number;
  completedTaskCount?: number;
  completedTasks?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface ProjectListResponse {
  success?: boolean;
  data?: Project[] | { projects?: Project[]; projectList?: Project[] };
}

export interface ProjectResponse {
  success?: boolean;
  data?: Project | { project?: Project };
}
