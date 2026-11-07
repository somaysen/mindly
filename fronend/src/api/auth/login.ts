import api from "@/config/axios";
import type { LoginCredentials } from "@/types/auth";

export type { LoginCredentials } from "@/types/auth";

export const login = async (data: LoginCredentials) => {
  const response = await api.post("/api/auth/login", {
    email: data.email.trim().toLowerCase(),
    password: data.password,
  });

  return response.data;
};