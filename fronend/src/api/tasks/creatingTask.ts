import api from "@/config/axios"

export const createTask = async (data: FormData) => {
    const response = await api.post("/api/task/create",data)
    console.log(data);
    return response.data;
};