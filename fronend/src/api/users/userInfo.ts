import api from "@/config/axios";
import type { UserInfoPayload } from "@/types/user";

export type { UserInfoPayload } from "@/types/user";

export const userInfo = async (data: UserInfoPayload) => {
  const response = await api.post("/api/user/info-user", data);

  return response.data;
};
