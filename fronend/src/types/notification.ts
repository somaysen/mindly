export interface NotificationPayload {
  title?: string;
  message?: string;
  userId?: string;
  type?: string;
  [key: string]: string | undefined;
}

export interface Notification {
  id?: string;
  _id?: string;
  title?: string;
  message?: string;
  read?: boolean;
  createdAt?: string;
  [key: string]: unknown;
}
