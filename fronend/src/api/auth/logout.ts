import api from "@/config/axios"

export const logout = async (data: FormData) => {
    const response = await api.post("/api/auth/logout",data)
    return response.data;
};