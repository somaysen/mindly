import * as api from "@/api";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: (data: FormData) => api.register(data),
    retry: 1,
  });
};

export const userLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: FormData) => api.login(data),
    retry: 1,
  });
};

export const useVerifyUser = () => {
  return useMutation({
    mutationKey: ["verify-user"],
    mutationFn: (token: string) => api.verifyUser(token),
    retry: 0,
  });
};
