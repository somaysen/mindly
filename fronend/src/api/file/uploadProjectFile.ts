
import api from "@/config/axios";

export async function uploadProjectFile(
  projectId: string,
  fileData: string,
  fileName: string,
) {
  const response = await api.post(
    `/api/file/project/${encodeURIComponent(projectId)}/files`,
    // Keep the extension so the project file list can recognize and open it.
    { fileData, title: fileName }
  );

  return response.data;
}
