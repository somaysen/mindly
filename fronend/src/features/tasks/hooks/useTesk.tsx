import * as api from "@/api";
import { useMutation, useQuery } from "@tanstack/react-query";

// Create Task
export const useTaskCreate = () => {
  return useMutation({
    mutationKey: ["taskCreating"],
    mutationFn: (data: FormData) => api.createTask(data),
    retry: 0,
  });
};

// Get Tasks
export const useTaskGet = (date?: string) => {
  return useQuery({
    queryKey: ["getTasks", date],
    queryFn: () => api.getTask(date),  
    retry: 0,
    enabled: true,
  });
};