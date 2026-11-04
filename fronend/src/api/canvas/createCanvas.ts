import api from "@/config/axios";

export interface CreateCanvasInput {
  title: string;
}

export const createCanvas = async (data: CreateCanvasInput) => {
  const response = await api.post("/api/canvas", data);
  return response.data;
};
