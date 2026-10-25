import api from "@/config/axios";

export const createIdea = async (data: FormData) => {
  const response = await api.post("/api/idea/", data);

  return response.data;
};
