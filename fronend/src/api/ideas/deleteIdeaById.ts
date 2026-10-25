import api from "@/config/axios";

export const deleteIdeaById = async (ideaId: string) => {
  const response = await api.delete(`/api/idea/${ideaId}`);

  return response.data;
};
