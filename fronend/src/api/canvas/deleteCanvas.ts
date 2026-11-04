import api from "@/config/axios";

export const deleteCanvas = async (canvasId: string) => {
  const response = await api.delete(
    `/api/canvas/${encodeURIComponent(canvasId)}`,
  );
  return response.data;
};
