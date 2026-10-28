import api from "@/config/axios"

export const completeTaskById = async (taskId: string, data: FormData) => {
  const response = await api.patch(`/api/task/complete/${taskId}`, data);

  return response.data;
};
