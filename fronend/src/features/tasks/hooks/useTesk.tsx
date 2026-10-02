import * as api from "@/api";

import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// ===============================
// CREATE TASK
// ===============================

export const useTaskCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["taskCreating"],

    mutationFn: async (data: FormData) => {
      return await api.createTask(data);
    },

    retry: 0,

    onSuccess: async () => {
      // Refresh task list after successful creation
      await queryClient.invalidateQueries({
        queryKey: ["getTasks"],
      });
    },
  });
};

// ===============================
// UPDATE TASK
// ===============================

export const useTaskUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["taskUpdating"],

    mutationFn: async ({
      taskId,
      data,
    }: {
      taskId: string;
      data: FormData;
    }) => {
      return await api.updateTask(taskId, data);
    },

    retry: 0,

    onSuccess: async () => {
      // Refresh task list after successful update
      await queryClient.invalidateQueries({
        queryKey: ["getTasks"],
      });
    },
  });
};

// ===============================
// GET TASKS
// ===============================

export const useTaskGet = (date?: string) => {
  return useQuery({
    queryKey: ["getTasks", date],

    queryFn: async () => {
      return await api.getTask(date);
    },

    retry: 0,

    enabled: true,
  });
};