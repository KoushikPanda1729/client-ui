import axiosInstance from "@/lib/axios";
import { AxiosRequestConfig } from "axios";

class ApiService {
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.get(url, config);
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.post(url, data, config);
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.put(url, data, config);
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.patch(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return axiosInstance.delete(url, config);
  }
}

export const apiService = new ApiService();
