import * as api from "@/api";
import { useMutation } from "@tanstack/react-query";

export const useUserInfo = () => {
  return useMutation({
    mutationKey: ["userInfo"],
    mutationFn: (data: FormData) => api.userInfo(data),
    retry: 0,
  });
};