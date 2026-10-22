
import api from "@/config/axios";

export async function getProjectFiles(projectId: string) {
  const response = await api.get(
    `/api/file/project/${encodeURIComponent(projectId)}/files`
  );

  return response.data;
}
