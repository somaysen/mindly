import api from "@/config/axios";
import type { Notification } from "@/types/notification";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const getNotifications = async (): Promise<Notification[]> => {
  const response = await api.get<unknown>("/api/notification/inbox");
  const body = response.data;
  const data = isRecord(body) && "data" in body ? body.data : body;
  const notifications = Array.isArray(data)
    ? data
    : isRecord(data) && Array.isArray(data.notifications)
      ? data.notifications
      : [];

  return notifications.filter(isRecord) as Notification[];
};
