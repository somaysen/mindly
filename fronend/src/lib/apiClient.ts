import axios from "axios";

const apiClient = axios.create({
  // Keep browser requests on this origin; next.config.ts proxies /api to the backend.
  baseURL: "/api",
  withCredentials: true,
  timeout: 10000,
});

/**
 * REQUEST INTERCEPTOR
 */
apiClient.interceptors.request.use(
  (config) => {
    // Authentication via cookie "token" (withCredentials: true) is now the single source of truth.
    return config;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized – please login again");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
