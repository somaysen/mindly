
import * as api from "@/api";
import { useQuery ,useMutation} from "@tanstack/react-query";

export const useProfileInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: api.getUserInfo,
    retry: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

export const useLogOut = () => {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => api.logout(new FormData()),
    retry: 0,
  });
};