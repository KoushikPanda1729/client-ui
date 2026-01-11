import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "@/utils/constants";

interface ErrorResponseData {
  message?: string;
  errors?: Record<string, string[]>;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important: Send cookies with requests
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

const refreshAccessToken = async (): Promise<{ id: number }> => {
  const response = await axios.post(
    `${API_BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
    {},
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // HTTP-only cookies are automatically sent with requests (withCredentials: true)
    // No need to manually add Authorization header
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry refresh endpoint itself
      if (originalRequest.url?.includes(API_ENDPOINTS.AUTH.REFRESH)) {
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshAccessToken();

        // Process queued requests
        processQueue(null);
        isRefreshing = false;

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - reject all queued requests
        processQueue(refreshError as AxiosError);
        isRefreshing = false;
        return Promise.reject(refreshError);
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
