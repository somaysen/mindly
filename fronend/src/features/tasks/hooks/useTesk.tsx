import * as api from "@/api";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// CREATE TASK
export const useTaskCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["taskCreating"],
    mutationFn: (data: FormData) => api.createTask(data),
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getTasks"] });
      queryClient.invalidateQueries({ queryKey: ["getCompleteTasks"] });
    },
  });
};

// UPDATE TASK
export const useTaskUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["taskUpdating"],
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: FormData;
    }) => api.updateTaskById(taskId, data),
    retry: 0,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["getTasks"] });
      queryClient.invalidateQueries({ queryKey: ["getCompleteTasks"] });
      queryClient.invalidateQueries({
        queryKey: ["getTaskById", variables.taskId],
      });
    },
  });
};

// GET ALL TASKS
export const useTaskGet = (date?: string, enabled = true) => {
  return useQuery({
    queryKey: ["getTasks", date],
    queryFn: () => api.getTask(date),
    enabled,
    retry: 0,
  });
};

// GET TASK BY ID
export const useTaskGetById = (taskId?: string) => {
  return useQuery({
    queryKey: ["getTaskById", taskId],
    queryFn: () => api.getTaskById(taskId!),
    enabled: Boolean(taskId),
    retry: 0,
  });
};

// DELETE TASK BY ID
export const useTaskDeleteById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteTaskById"],
    mutationFn: (taskId: string) => api.deleteTaskById(taskId),
    retry: 0,
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ["getTasks"] });
      queryClient.invalidateQueries({ queryKey: ["getCompleteTasks"] });
      queryClient.invalidateQueries({
        queryKey: ["getTaskById", taskId],
      });
    },
  });
};

export const useTaskComplete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["taskCompleted"],
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: FormData;
    }) => api.completeTaskById(taskId, data),
    retry: 0,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["getTasks"] });
      queryClient.invalidateQueries({ queryKey: ["getCompleteTasks"] });
      queryClient.invalidateQueries({
        queryKey: ["getTaskById", variables.taskId],
      });
    },
  });
};
