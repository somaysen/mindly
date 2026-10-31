import api from "@/config/axios";

export const getIdea = async () => {
  const response = await api.get("/api/idea/");

  return response.data;
};
