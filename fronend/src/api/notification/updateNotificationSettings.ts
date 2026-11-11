import api from "@/config/axios";
import type { NotificationSettings } from "@/types/notification";

export const updateNotificationSettings = async (
  settings: Partial<NotificationSettings>,
): Promise<void> => {
  // The API stores these options as nested `{ enabled }` fields, but its
  // PATCH contract accepts the changed setting as a boolean.
  await api.patch("/api/notification/settings", settings);
};
