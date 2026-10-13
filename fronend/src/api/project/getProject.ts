import api from "@/config/axios"

export const getProject = async () => {
  const response = await api.get("/api/Project/get-project");
  return response.data;
};