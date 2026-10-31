import api from "@/config/axios";
import { taskFormDataToPayload } from "./taskFormDataToPayload";

export const createTask = async (data: FormData) => {
  const response = await api.post(
    "/api/task/create",
    taskFormDataToPayload(data),
    { headers: { "Content-Type": "application/json" } },
  );

  return response.data;
};


