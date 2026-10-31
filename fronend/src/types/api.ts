/** Common JSON envelope used by the API. `data` is endpoint-specific. */
export interface ApiResponse<T = unknown> {
  success?: boolean;
  message?: string;
  data?: T;
  [key: string]: unknown;
}

export interface ApiErrorResponse {
  success?: false;
  message?: string;
  error?: string;
  [key: string]: unknown;
}

export interface IdParams {
  id: string;
}
