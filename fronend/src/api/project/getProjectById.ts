import api from "@/config/axios"

export const getProjectById = async (projectId: string) => {
  const response = await api.get(`/api/Project/${projectId}`);
  return response.data;
};
