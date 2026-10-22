
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectById } from "@/api/project/getProjectById";
import { getProjectFiles } from "@/api/file/getfile";
import { uploadProjectFile } from "@/api/file/uploadProjectFile";
import { deleteProjectFile } from "@/api/file/deleteProjectFile";

export const useGetProjectDetails = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectById(projectId),
    enabled: Boolean(projectId),
  });
};

// Get project files
export const useGetProjectFiles = (projectId: string) => {
  return useQuery({
    queryKey: ["projectFiles", projectId],
    queryFn: () => getProjectFiles(projectId),
    enabled: Boolean(projectId),
  });
};

// Upload project file
export const useUploadProjectFile = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["uploadProjectFile"],
    mutationFn: ({ fileData, fileName }: { fileData: string; fileName: string }) =>
      uploadProjectFile(projectId, fileData, fileName),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["projectFiles", projectId],
      });
    },
  });
};

// Delete project file
export const useDeleteProjectFile = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["deleteProjectFile"],
    mutationFn: (fileId: string) => deleteProjectFile(projectId, fileId),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["projectFiles", projectId],
      });
    },
  });
};
