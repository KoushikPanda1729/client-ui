import { apiService } from "./api";
import { CATALOG_SERVICE } from "@/config/apiConfig";

export interface ProductCategory {
  _id: string;
  name: string;
  priceCofigration: {
    size?: {
      priceType: string;
      availableOptions: string[];
      _id: string;
    };
    toppings?: {
      priceType: string;
      availableOptions: string[];
      _id: string;
    };
  };
  attributes: Array<{
    name: string;
    wigetType: string;
    defaultValue: string;
    availableOptions: string[];
    _id: string;
  }>;
  tenantId?: string;
  __v: number;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: ProductCategory;
  priceConfiguration: Record<
    string,
    {
      priceType: string;
      availableOptions: Record<string, number>;
      _id: string;
    }
  >;
  attributes: Array<{
    name: string;
    value: string;
    _id: string;
  }>;
  tenantId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ProductResponse {
  message: string;
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

class ProductService {
  async getProducts(
    page: number = 1,
    limit: number = 10,
    tenantId?: string
  ): Promise<ProductResponse> {
    let url = `${CATALOG_SERVICE}/products?page=${page}&limit=${limit}`;

    if (tenantId) {
      url += `&tenantId=${tenantId}`;
    }

    const response = await apiService.get<ProductResponse>(url);
    return response;
  }

  async getProductById(id: string): Promise<{ message: string; data: Product }> {
    const response = await apiService.get<{ message: string; data: Product }>(
      `${CATALOG_SERVICE}/products/${id}`
    );
    return response;
  }
}

export const productService = new ProductService();
