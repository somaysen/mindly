import api from "@/config/axios"

export const verifyUser = async (data: FormData) => {
    const response = await api.post("/api/auth/verifyUser",data)
    return response.data;
};