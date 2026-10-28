import api from "@/config/axios";
import type { TaskResponse } from "@/types/task";

export const getCompletedTask = async (date?: string): Promise<TaskResponse> => {
  const { data } = await api.get<TaskResponse>("/api/task/completed", {
    params: date ? { date } : {},
  });

  return data;
};
