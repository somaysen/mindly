import api from "@/config/axios";
import type { ScheduleResponse } from "@/types/task";

export const getSchedule = async (): Promise<ScheduleResponse> => {
  const response = await api.get<ScheduleResponse>("/api/schedule/today");

  return response.data;
};