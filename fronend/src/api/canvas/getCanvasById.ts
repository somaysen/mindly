import api from "@/config/axios";

export const getCanvasById = async (canvasId: string) => {
  const response = await api.get(
    `/api/canvas/${encodeURIComponent(canvasId)}`,
  );
  return response.data;
};
