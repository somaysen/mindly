
import api from "@/config/axios";

export async function uploadProjectFile(
  projectId: string,
  fileData: string,
  fileName: string,
) {
  const title = fileName.replace(/\.[^.]+$/, "");

  const response = await api.post(
    `/api/file/project/${encodeURIComponent(projectId)}/files`,
    { fileData, title }
  );

  return response.data;
}
