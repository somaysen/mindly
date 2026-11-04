import api from "@/config/axios";
import type { CanvasMember, CanvasMembersResponse, CanvasRole } from "@/types/canvas";

export const getCanvasMembers = async (canvasId: string) => {
  const response = await api.get<CanvasMembersResponse>(
    `/api/canvas/${encodeURIComponent(canvasId)}/members`,
  );
  return response.data.data;
};

export const inviteCanvasMember = async ({
  canvasId,
  email,
  role,
}: {
  canvasId: string;
  email: string;
  role: Exclude<CanvasRole, "owner">;
}) => {
  const response = await api.post<{ success: boolean; data: CanvasMember }>(
    `/api/canvas/${encodeURIComponent(canvasId)}/members`,
    { email, role },
  );
  return response.data.data;
};

export const updateCanvasMemberRole = async ({
  canvasId,
  memberId,
  role,
}: {
  canvasId: string;
  memberId: string;
  role: Exclude<CanvasRole, "owner">;
}) => {
  const response = await api.patch<{ success: boolean; data: CanvasMember }>(
    `/api/canvas/${encodeURIComponent(canvasId)}/members/${encodeURIComponent(memberId)}`,
    { role },
  );
  return response.data.data;
};

export const removeCanvasMember = async ({
  canvasId,
  memberId,
}: {
  canvasId: string;
  memberId: string;
}) => {
  const response = await api.delete<{ success: boolean; data: { userId: string } }>(
    `/api/canvas/${encodeURIComponent(canvasId)}/members/${encodeURIComponent(memberId)}`,
  );
  return response.data.data;
};
