import api from "@/config/axios";

export const getIdeaById = async (ideaId: string) => {
  const response = await api.get(`/api/idea/${ideaId}`);
  return response.data;
};
