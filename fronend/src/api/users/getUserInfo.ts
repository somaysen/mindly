import api from "@/config/axios";

export const getUserInfo = async () => {
  const response = await api.get("/api/user/info-user");

  console.log(response)
  return response.data;
};