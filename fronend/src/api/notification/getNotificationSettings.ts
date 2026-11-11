import api from "@/config/axios";
import type { NotificationSettings } from "@/types/notification";

type ApiSetting = boolean | { enabled?: boolean } | null | undefined;

type ApiSettingsRecord = Record<string, ApiSetting>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readEnabled = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (isRecord(value)) return value.enabled === true;
  return false;
};

export const getNotificationSettings = async (): Promise<NotificationSettings> => {
  const response = await api.get<unknown>("/api/notification/settings");
  const body = isRecord(response.data) ? response.data : {};
  const data = isRecord(body.data) ? body.data : body;
  const rawSettings = isRecord(data.settings)
    ? (data.settings as ApiSettingsRecord)
    : (data as ApiSettingsRecord);

  return {
    notificationsEnabled: readEnabled(rawSettings.notificationsEnabled),
    taskReminders: readEnabled(rawSettings.taskReminders),
    focusSessions: readEnabled(rawSettings.focusSessions),
    weeklyReflections: readEnabled(rawSettings.weeklyReflections),
  };
};
