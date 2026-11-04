import api from "@/config/axios";

export const getCanvases = async () => {
  const response = await api.get("/api/canvas");
  return response.data;
};
