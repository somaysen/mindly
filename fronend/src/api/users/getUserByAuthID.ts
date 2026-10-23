import api from "@/config/axios";

export const getUserByAuthID = async () => {
  const response = await api.get("/api/user/get-info/authID");

  return response.data;
};