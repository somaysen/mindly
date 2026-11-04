import api from "@/config/axios";

export interface UpdateCanvasInput {
  title: string;
  snapshot?: unknown;
}

export const updateCanvas = async ({
  canvasId,
  data,
}: {
  canvasId: string;
  data: UpdateCanvasInput;
}) => {
  const response = await api.patch(
    `/api/canvas/${encodeURIComponent(canvasId)}`,
    data,
  );
  return response.data;
};
