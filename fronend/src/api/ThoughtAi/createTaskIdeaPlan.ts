import api from "@/config/axios";

export type CreateTaskIdeaPlanPayload = {
  text?: string;
  ideaText?: string;
  taskText?: string;
  [key: string]: unknown;
};

export const createTaskIdeaPlan = async (payload: CreateTaskIdeaPlanPayload) => {
  const response = await api.post("/api/ai/task-idea-plan", payload);
  return response.data;
};
