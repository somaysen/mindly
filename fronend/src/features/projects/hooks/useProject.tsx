import * as api from "@/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Fetch all projects
export const useGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: api.getProject,
  });
};

// Fetch project by ID
export const useGetProjectById = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => api.getProjectById(projectId),
    enabled: Boolean(projectId),
  });
};

// Create project
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["createProject"],
    mutationFn: api.createProject,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });
};
