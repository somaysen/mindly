import * as api from "@/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { NotificationSettings } from "@/types/notification";

const notificationSettingsQueryKey = ["notificationSettings"];

export const useNotificationSettings = () =>
  useQuery({
    queryKey: notificationSettingsQueryKey,
    queryFn: api.getNotificationSettings,
    retry: 0,
  });

export const useUpdateNotificationSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.updateNotificationSettings,
    onMutate: async (changes: Partial<NotificationSettings>) => {
      await queryClient.cancelQueries({ queryKey: notificationSettingsQueryKey });

      const previousSettings = queryClient.getQueryData<NotificationSettings>(
        notificationSettingsQueryKey,
      );

      if (previousSettings) {
        queryClient.setQueryData<NotificationSettings>(
          notificationSettingsQueryKey,
          { ...previousSettings, ...changes },
        );
      }

      return { previousSettings };
    },
    onError: (_error, _changes, context) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(
          notificationSettingsQueryKey,
          context.previousSettings,
        );
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: notificationSettingsQueryKey }),
  });
};
