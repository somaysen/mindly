import * as api from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useScheduleGet = (enabled = true) => {
  return useQuery({
    queryKey: ["getSchedule"],
    queryFn: () => api.getSchedule(),
    enabled,
    retry: 0,
  });
};
