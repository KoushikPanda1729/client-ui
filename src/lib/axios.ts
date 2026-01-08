import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "@/utils/constants";
import { clearAuth } from "@/utils/helpers";

interface ErrorResponseData {
  message?: string;
  errors?: Record<string, string[]>;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important: Send cookies with requests
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // No need to manually add Authorization header
    // HTTP-only cookies are automatically sent with requests
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    const errorData = error.response?.data as ErrorResponseData | undefined;
    const errorMessage = errorData?.message || error.message || "An error occurred";

    return Promise.reject({
      message: errorMessage,
      statusCode: error.response?.status || 500,
      errors: errorData?.errors,
    });
  }
);

export default axiosInstance;
