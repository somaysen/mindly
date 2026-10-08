import axios from "axios";
import { clearAuthCookies, isPublicPath } from "@/lib/auth";

const isPublicRoute = (path: string) => {
  if (!path) return false;

  return (
    isPublicPath(path) ||
    path.includes("/user-verification")
  );
};

const api = axios.create({
  // Keep browser requests on this origin; next.config.ts proxies /api to the backend.
  baseURL: "",

  headers: {
    "Content-Type": "application/json",
  },

  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", {
      url: response.config.url,
      status: response.status,
    });

    return response;
  },

  async (error) => {
    const status = error.response?.status;
    const responseData = error.response?.data;
    const originalRequest = error.config;

    const currentPath =
      typeof window !== "undefined"
        ? window.location.pathname
        : "";

    console.log("❌ Axios Error");
    console.log("➡️ URL:", originalRequest?.url);
    console.log("➡️ Method:", originalRequest?.method);
    console.log("➡️ Status:", status);
    console.log("➡️ Response:", responseData);

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

    /*
    ==========================================
    401 → REFRESH ACCESS TOKEN
    ==========================================
    */

    if (
      !publicRoute &&
      status === 401 &&
      !originalRequest?._retry
    ) {
      console.log("🔄 401 → trying refresh");

      originalRequest._retry = true;

      try {
        // IMPORTANT:
        // baseURL already contains /api
        const refreshResponse = await api.post(
          "/api/auth/refresh"
        );

        console.log(
          "✅ Refresh successful:",
          refreshResponse.data
        );

        console.log(
          "🔁 Retrying:",
          originalRequest.url
        );

        return api(originalRequest);
      } catch (refreshError: any) {
        console.error(
          "❌ Refresh failed:",
          refreshError?.response?.data ||
            refreshError?.message
        );

        clearAuthCookies();

        if (
          typeof window !== "undefined" &&
          !isPublicRoute(currentPath)
        ) {
          window.location.replace("/login");
        }

        return Promise.reject(refreshError);
      }
    }

    /*
    ==========================================
    OTHER AUTH ERRORS
    ==========================================
    */

    if (
      !publicRoute &&
      (
        status === 403 ||
        message.toLowerCase().includes("unauthorized") ||
        message.toLowerCase().includes("unauthenticated") ||
        message.toLowerCase().includes("invalid token") ||
        message.toLowerCase().includes("token expired")
      )
    ) {
      console.log("🚪 Authentication failed");

      clearAuthCookies();

      if (
        typeof window !== "undefined" &&
        !isPublicRoute(currentPath)
      ) {
        window.location.replace("/login");
      }
    }

    /*
    ==========================================
    RETURN ORIGINAL ERROR
    ==========================================
    */

    if (error.response) {
      error.message = message;
    }

    return Promise.reject(error);
  }
);

export default api;
