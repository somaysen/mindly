export type CanvasRole = "owner" | "editor" | "viewer";

export interface CanvasMember {
  userId: string;
  email: string;
  role: CanvasRole;
  name?: string;
  avatar?: string;
  avatarUrl?: string;
  imageUrl?: string;
  user?: {
    name?: string;
    avatar?: string;
    avatarUrl?: string;
    imageUrl?: string;
  };
}

export interface CanvasMembersResponse {
  success: boolean;
  data: CanvasMember[];
}
