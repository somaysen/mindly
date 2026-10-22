
import api from "@/config/axios";

export async function deleteProjectFile(
  projectId: string,
  fileId: string
) {
  const response = await api.delete(
    `/api/file/project/${encodeURIComponent(projectId)}/files/${encodeURIComponent(fileId)}`
  );

  return response.data;
}
