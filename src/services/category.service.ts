import { apiService } from "./api";
import { CATALOG_SERVICE } from "@/config/apiConfig";

export interface CategoryAttribute {
  name: string;
  wigetType: string;
  defaultValue: string;
  availableOptions: string[];
  _id: string;
}

export interface CategoryPriceConfiguration {
  [key: string]: {
    priceType: string;
    availableOptions: string[];
    _id: string;
  };
}

export interface Category {
  _id: string;
  name: string;
  priceCofigration: CategoryPriceConfiguration;
  attributes: CategoryAttribute[];
  tenantId?: string;
  __v: number;
}

export interface CategoryResponse {
  message: string;
  data: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class CategoryService {
  async getCategories(
    page: number = 1,
    limit: number = 50,
    tenantId?: string
  ): Promise<CategoryResponse> {
    let url = `${CATALOG_SERVICE}/categories?page=${page}&limit=${limit}`;

    if (tenantId) {
      url += `&tenantId=${tenantId}`;
    }

    const response = await apiService.get<CategoryResponse>(url);
    return response;
  }

  async getCategoryById(id: string): Promise<{ message: string; data: Category }> {
    const response = await apiService.get<{ message: string; data: Category }>(
      `${CATALOG_SERVICE}/categories/${id}`
    );
    return response;
  }
}

export const categoryService = new CategoryService();
