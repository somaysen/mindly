import api from "@/config/axios";
import type { TaskResponse } from "@/types/task";
export const getTask = async (): Promise<TaskResponse> => {
  const response = await api.get("/api/task/getTaskBy-UserId");
  console.log(response)

  return response.data;
};
