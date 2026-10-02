import api from "@/config/axios";
import type { TaskResponse } from "@/types/task";
export const getTask = async (date?: string): Promise<TaskResponse> => {
  const response = await api.get("/api/task/user", {
    params: date ? { date } : undefined,
  });
  return response.data;
};
