import api from "@/config/axios";

export const createCanvasSyncTicket = async (canvasId: string) => {
  const response = await api.post(
    `/api/canvas/${encodeURIComponent(canvasId)}/sync-ticket`,
  );
  return response.data;
};
