export type CanvasRole = "owner" | "editor" | "viewer";

export interface CanvasMember {
  userId: string;
  email: string;
  role: CanvasRole;
}

export interface CanvasMembersResponse {
  success: boolean;
  data: CanvasMember[];
}
