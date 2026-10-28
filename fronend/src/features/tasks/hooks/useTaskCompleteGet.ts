import { useQuery } from "@tanstack/react-query";
import { getCompletedTask } from "@/api/tasks/getCompletedTask";

export const useTaskCompleteGet = (date?: string, enabled = true) => {
  return useQuery({
    queryKey: ["getCompleteTasks", date],
    queryFn: () => getCompletedTask(date),
    enabled,
    retry: 0,
  });
};
