import api from "@/config/axios";

export const verifyUser = async (token: string) => {
  if (!token) {
    throw new Error("Verification token is required");
  }

  const response = await api.post(
    `/api/auth/verify-email?token=${encodeURIComponent(token)}`,
  );

  return response.data;
};
