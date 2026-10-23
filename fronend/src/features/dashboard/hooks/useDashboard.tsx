import * as api from "@/api";
import { useQuery } from "@tanstack/react-query";

export const useUserInfo = () => {
  return useQuery({
    queryKey: ["userInfo"],
    queryFn: api.getUserInfo,
    retry: 0,
    refetchOnWindowFocus: false,
  });
};

export const useGetUserByAuthID = () => {
  return useQuery({
    queryKey: ["getUserByAuthID"],
    queryFn: api.getUserByAuthID,
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
