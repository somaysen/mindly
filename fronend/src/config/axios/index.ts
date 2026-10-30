import axios from "axios";
import {
  clearAuthCookies,
  getAccessToken,
  isPublicPath,
} from "@/lib/auth";

const isPublicRoute = (path: string) =>
  Boolean(path) && (isPublicPath(path) || path.includes("/user-verification"));

const api = axios.create({
  // Keep browser requests on this origin; the Next.js route proxies /api.
  baseURL: "",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const responseData = error.response?.data;
    const originalRequest = error.config;
    const requestPath = originalRequest?.url?.split("?")[0];
    const isRefreshRequest = requestPath === "/api/auth/refresh";
    const currentPath =
      typeof window !== "undefined" ? window.location.pathname : "";

    let message = "Something went wrong";
    if (responseData) {
      if (typeof responseData === "string") {
        message = responseData.slice(0, 200);
      } else if (responseData.message) {
        message = responseData.message;
      } else if (responseData.error) {
        message = responseData.error;
      }
    }

    const publicRoute = isPublicRoute(currentPath);

    if (
      !publicRoute &&
      !isRefreshRequest &&
      status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await api.post("/api/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        clearAuthCookies();
        if (typeof window !== "undefined" && !isPublicRoute(currentPath)) {
          window.location.replace("/login");
        }
        return Promise.reject(refreshError);
      }
    }

    if (
      !publicRoute &&
      !isRefreshRequest &&
      (status === 403 ||
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("unauthenticated") ||
        message.toLowerCase().includes("invalid token") ||
        message.toLowerCase().includes("token expired"))
    ) {
      clearAuthCookies();
      if (typeof window !== "undefined" && !isPublicRoute(currentPath)) {
        window.location.replace("/login");
      }
    }

    if (error.response) {
      error.message = message;
    }

    return Promise.reject(error);
  }
);

export default api;
