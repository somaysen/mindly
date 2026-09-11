import api from "@/config/axios"

export const userInfo = async (data: FormData) => {
   const response = await api.post("/api/user/info-user",data)
      return response.data;
  };