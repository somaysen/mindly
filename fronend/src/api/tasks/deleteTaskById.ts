import api from "@/config/axios";

export const deleteTaskById = async (taskId: string) => {
  const response = await api.delete(`/api/task/${encodeURIComponent(taskId)}`);

  return response.data;
};
