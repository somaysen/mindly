import api from "@/config/axios";

export const markNotificationRead = async (notificationId: string): Promise<void> => {
  await api.patch(`/api/notification/${encodeURIComponent(notificationId)}/read`);
};
