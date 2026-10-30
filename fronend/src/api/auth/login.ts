import api from "@/config/axios"

export type LoginCredentials = {
    email: string;
    password: string;
};

export const login = async (data: LoginCredentials) => {
    const response = await api.post("/api/auth/login", data, {
        headers: { "Content-Type": "application/json" },
    });
    return response.data;
};
