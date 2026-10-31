export interface IdeaPayload {
  ideaName: string;
  description?: string;
}

export interface Idea {
  id?: string | number;
  _id?: string | number;
  ideaId?: string | number;
  ideaName?: string;
  title?: string;
  name?: string;
  thought?: string;
  idea?: string;
  content?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface IdeaListResponse {
  success?: boolean;
  data?: Idea[] | { ideas?: Idea[]; items?: Idea[] };
}

export interface IdeaResponse {
  success?: boolean;
  data?: Idea | { idea?: Idea };
}
