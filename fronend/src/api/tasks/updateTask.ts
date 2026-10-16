import api from "@/config/axios"

export const updateTask = async (taskId: string, data: FormData) => {
  const response = await api.put(`/api/task/update/${taskId}`, data);

  return response.data;
};