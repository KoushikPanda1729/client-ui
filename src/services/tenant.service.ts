import { apiService } from "./api";

export interface Tenant {
  id: number;
  name: string;
  address: string;
  updatedAt: string;
  createdAt: string;
}

export interface TenantResponse {
  data: Tenant[];
  pagination: {
    total: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
  };
}

class TenantService {
  async getTenants(page: number = 1, limit: number = 10): Promise<TenantResponse> {
    const response = await apiService.get<TenantResponse>(
      `/api/auth/tenants?page=${page}&limit=${limit}`
    );
    return response;
  }
}

export const tenantService = new TenantService();
