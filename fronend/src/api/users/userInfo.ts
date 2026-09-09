import api from "@/config/axios"

export const userInfo = async (data: FormData) => {
    const response = await api.get("/api/user/info-user",data)
    return response.data;
};