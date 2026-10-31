export interface UserInfoPayload {
  avatar?: string;
  name?: string;
  interests?: string[];
  planning?: string[];
}

export interface User {
  id?: string;
  _id?: string;
  authID?: string;
  email?: string;
  name?: string;
  avatar?: string;
  interests?: string[];
  planning?: string[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface UserInfoResponseData {
  user?: User;
  data?: User | { user?: User };
  [key: string]: unknown;
}
