import api from "@/config/axios";
import type { TaskResponse } from "@/types/task";
export const getTask = async (date?: string): Promise<TaskResponse> => {
  const response = await api.get("/api/task/getTaskBy-UserId", {
    params: date ? { date } : undefined,
  });
  console.log(response)

  return response.data;
};
