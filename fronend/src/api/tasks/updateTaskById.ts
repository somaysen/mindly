import api from "@/config/axios";
import { taskFormDataToPayload } from "./taskFormDataToPayload";

export const updateTaskById = async (taskId: string, data: FormData) => {
  const response = await api.put(
    `/api/task/update/${encodeURIComponent(taskId)}`,
    taskFormDataToPayload(data),
    { headers: { "Content-Type": "application/json" } },
  );

  return response.data;
};
