export interface Task {
  _id: string;
  taskName: string;
  description: string;
  dueDate: string | null;
  dueTime: string | null;
  priority: "low" | "medium" | "high";
  status: "todo" | "in-progress" | "completed";
  user: string;
  checklist: unknown[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TaskResponse {
  success: boolean;
  data: Task[];
}