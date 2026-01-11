import { apiService } from "./api";
import { CATALOG_SERVICE } from "@/config/apiConfig";

export interface Topping {
  _id: string;
  name: string;
  image: string;
  price: number;
  tenantId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ToppingResponse {
  message: string;
  data: Topping[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class ToppingService {
  async getToppings(
    page: number = 1,
    limit: number = 10,
    tenantId?: string
  ): Promise<ToppingResponse> {
    let url = `${CATALOG_SERVICE}/toppings?page=${page}&limit=${limit}`;

    if (tenantId) {
      url += `&tenantId=${tenantId}`;
    }

    const response = await apiService.get<ToppingResponse>(url);
    return response;
  }

  async getToppingById(id: string): Promise<{ message: string; data: Topping }> {
    const response = await apiService.get<{ message: string; data: Topping }>(
      `${CATALOG_SERVICE}/toppings/${id}`
    );
    return response;
  }
}

export const toppingService = new ToppingService();
