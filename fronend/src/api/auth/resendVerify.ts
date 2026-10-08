import api from "@/config/axios";

export const resendVerification = async (data: FormData) => {
  const userId = data.get("userId");
  if (typeof userId !== "string" || !userId.trim()) {
    throw new Error("A user ID is required to resend verification email.");
  }

  const response = await api.post("/api/auth/resend-verification", data);
  return response.data;
};
