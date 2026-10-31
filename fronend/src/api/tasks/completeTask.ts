import api from "@/config/axios"
import { taskFormDataToPayload } from "./taskFormDataToPayload";

export const completeTaskById = async (taskId: string, data: FormData) => {
  const response = await api.patch(
    `/api/task/complete/${encodeURIComponent(taskId)}`,
    taskFormDataToPayload(data),
    { headers: { "Content-Type": "application/json" } },
  );

  return response.data;
};
