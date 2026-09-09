import api from "@/config/axios"

export const getVerify = async (data: FormData) => {
    const response = await api.get("/api/auth/get-verify-email",data)
    return response.data;
};