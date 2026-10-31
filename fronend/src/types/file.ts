export interface UploadProjectFilePayload {
  fileData: string;
  fileName: string;
}

export interface ProjectFile {
  id?: string;
  fileId?: string;
  _id?: string;
  name?: string;
  fileName?: string;
  originalName?: string;
  title?: string;
  size?: number;
  fileSize?: number;
  content?: string;
  downloadUrl?: string;
  fileUrl?: string;
  cloudinaryUrl?: string;
  url?: string;
  mimeType?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface ProjectFilesResponse {
  success?: boolean;
  data?: ProjectFile[] | { files?: ProjectFile[]; items?: ProjectFile[] };
}
