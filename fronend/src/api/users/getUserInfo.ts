import api from "@/config/axios";

export const getUserInfo = async () => {
  const response = await api.get("/api/user/get-info");

  return response.data;
};