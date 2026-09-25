import api from "@/config/axios";
import type { TaskResponse } from "@/types/task";
export const getTask = async (): Promise<TaskResponse> => {
  const response = await api.post("/api/task/getTask", data);

  return response.data;
};
