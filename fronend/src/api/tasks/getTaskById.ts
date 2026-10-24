import api from "@/config/axios";

export const getTaskById = async (taskId: string) => {
  const response = await api.get(`/api/task/${taskId}`);
  return response.data;
};
