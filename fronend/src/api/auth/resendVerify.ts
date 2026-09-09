import api from "@/config/axios"

export const resendVerification = async (data: FormData) => {
    const response = await api.post("/api/auth/resend-verification",data)
    return response.data;
};