import api from "@/config/axios";
import type { ProjectPayload } from "@/types/project";

export const createProject = async (data: ProjectPayload) => {
  const response = await api.post(
    "/api/Project/creating-project",
    data,
    { headers: { "Content-Type": "application/json" } },
  );
  return response.data;
};