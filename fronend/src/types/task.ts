export interface TaskChecklistItem {
  text?: string;
  title?: string;
  completed?: boolean;
  [key: string]: unknown;
}

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in-progress" | "completed";

/** Fields serialized into FormData by task create/update/complete calls. */
export interface TaskPayload {
  taskName?: string;
  description?: string;
  dueDate?: string | null;
  dueTime?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  project?: string;
  checklist?: TaskChecklistItem[] | string;
}

export interface Task {
  _id: string;
  taskName: string;
  description: string;
  dueDate: string | null;
  dueTime: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  user: string;
  checklist: TaskChecklistItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TaskResponse {
  success: boolean;
  data: Task[];
}

export interface TaskItemResponse {
  success?: boolean;
  data: Task | { task?: Task };
}

export interface TaskMutationResponse {
  success?: boolean;
  message?: string;
  data?: Task | Task[];
}
