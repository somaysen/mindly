import api from "@/config/axios"

export const updateIdeaById = async (ideaId: string, data: FormData) => {
  const response = await api.put(`/api/idea/update/${ideaId}`, data);

  return response.data;
};
