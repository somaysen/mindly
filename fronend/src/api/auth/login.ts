import api from "@/config/axios"
import type { LoginCredentials } from "@/types/auth";

export type { LoginCredentials } from "@/types/auth";

export const login = async (data: LoginCredentials) => {
    const response = await api.post("/api/auth/login", data, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
};
