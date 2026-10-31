export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginCredentials {}

export interface VerifyUserPayload {
  token: string;
}

export interface ResendVerificationPayload {
  userId: string;
}

export interface GetVerificationPayload {
  email?: string;
  userId?: string;
}

export interface AuthUser {
  id?: string;
  _id?: string;
  email?: string;
  name?: string;
}

export interface AuthResponseData {
  user?: AuthUser;
  userId?: string;
  token?: string;
  accessToken?: string;
}
