import api from "@/config/axios";

export type UserInfoPayload = {
  name?: string;
  interests?: string[];
  planning?: string[];
};

export const userInfo = async (data: UserInfoPayload) => {
  const response = await api.post("/api/user/info-user", data);

  return response.data;
};