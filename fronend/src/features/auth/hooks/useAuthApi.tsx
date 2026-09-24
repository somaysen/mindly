import * as api from "@/api";
import { useMutation } from "@tanstack/react-query";

export const useRegister = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: (data: FormData) => api.register(data),
    retry: 0,
  });
};

export const useLogin = () => {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: FormData) => api.login(data),
    retry: 0,
  });
};

export const useVerifyUser = () => {
  return useMutation({
    mutationKey: ["verify-user"],

    mutationFn: ({ token }: { token: string }) => {
      return api.verifyUser(token);
    },

    retry: 0,
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationKey: ["resend-verification"],

    mutationFn: ({ userId }: { userId: string }) => {
      const data = new FormData();

      data.append("userId", userId);

      return api.resendVerification(data);
    },

    retry: 0,
  });
};


export const useLogOut = () => {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => api.logout(new FormData()),
    retry: 0,
  });
};