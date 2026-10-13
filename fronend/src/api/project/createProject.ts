import api from "@/config/axios"

export const createProject = async (data: FormData) => {
  const response = await api.post(
    "/api/Project/creating-project",
    data
  );
  return response.data;
};