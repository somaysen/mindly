import * as api from "@/api";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

// CREATE idea
export const useIdeaCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["ideaCreating"],
    mutationFn: (data: FormData) => api.createIdea(data),
    retry: 0,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getIdeas"] });
    },
  });
};

// UPDATE idea
export const useIdeaUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["ideaUpdating"],
    mutationFn: ({
      ideaId,
      data,
    }: {
      ideaId: string;
      data: FormData;
    }) => api.updateIdeaById(ideaId, data),
    retry: 0,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["getIdeas"] });
      queryClient.invalidateQueries({
        queryKey: ["getIdeaById", variables.ideaId],
      });
    },
  });
};

// GET ALL ideaS
export const useIdeaGet = () => {
  return useQuery({
    queryKey: ["getIdeas"],
    queryFn: () => api.getIdea(),
    retry: 0,
  });
};

// GET idea BY ID
export const useIdeaGetById = (ideaId?: string) => {
  return useQuery({
    queryKey: ["getIdeaById", ideaId],
    queryFn: () => api.getIdeaById(ideaId!),
    enabled: Boolean(ideaId),
    retry: 0,
  });
};

// DELETE idea BY ID
export const useIdeaDeleteById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteIdeaById"],
    mutationFn: (ideaId: string) => api.deleteIdeaById(ideaId),
    retry: 0,
    onSuccess: (_, ideaId) => {
      queryClient.invalidateQueries({ queryKey: ["getIdeas"] });
      queryClient.invalidateQueries({
        queryKey: ["getIdeaById", ideaId],
      });
    },
  });
};
