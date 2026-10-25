import api from "@/config/axios";

export const getIdea = async () => {
  const response = await api.post("/api/idea/");

  return response.data;
};
