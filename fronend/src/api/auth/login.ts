import api from "@/config/axios"

export const login = async (data: FormData) => {
    const response = await api.post("/api/auth/login",data)
    return response.data;
};