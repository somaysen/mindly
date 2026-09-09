import { useMutation } from "@tanstack/react-query";
import * as api from "@/api";

export const useUserInfo = () => {
  return useMutation({
    mutationKey: ["userInfo"],
    mutationFn: (data: FormData) => api.userInfo(data),
  });
};
