import api from "@/config/axios"

export const createNotification = async (data: FormData) => {
    const response = await api.post("/api/notification/create-notification",data)
    return response.data;
};