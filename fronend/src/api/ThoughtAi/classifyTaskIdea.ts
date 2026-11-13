import api from "@/config/axios";

export type ClassifyTaskIdeaPayload = {
  text?: string;
  ideaText?: string;
  taskText?: string;
  [key: string]: unknown;
};

export const classifyTaskIdea = async (payload: ClassifyTaskIdeaPayload) => {
  const response = await api.post("/api/ai/classify-task-idea", payload);
  return response.data;
};
