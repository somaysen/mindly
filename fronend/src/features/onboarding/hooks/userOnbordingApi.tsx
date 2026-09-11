import { useMutation } from "@tanstack/react-query";
import * as api from "@/api";

export const useUserInfo = () => {
  return useMutation({
    mutationKey: ["userInfo"],
    mutationFn: (data: FormData) => api.userInfo(data),
    retry: 0
  });
};

export const useTaskCreate = () => {
  return useMutation({
    mutationKey: ["taskCrating"],
    mutationFn: (data: FormData) => api.createTask(data),
    retry: 0
  });
};

export const useNotificationCrate = () => {
  return useMutation({
    mutationKey: [""],
    mutationFn: (data: FormData) => api.createNotification(data),
    retry: 0
  });
};
