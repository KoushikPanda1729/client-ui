import "server-only";

import { serverFetch } from "@/lib/fetch-server";
import { CATALOG_SERVICE } from "@/config/apiConfig";
import { CategoryResponse, Category } from "./category.service";

/**
 * SERVER-ONLY Service - Do not import in Client Components!
 * This service is for Server Components and Server Actions only.
 * For client-side, use category.service.ts instead.
 */
class CategoryServiceServer {
  async getCategories(
    page: number = 1,
    limit: number = 50,
    tenantId?: string
  ): Promise<CategoryResponse> {
    let url = `${CATALOG_SERVICE}/categories?page=${page}&limit=${limit}`;

    if (tenantId) {
      url += `&tenantId=${tenantId}`;
    }

    return serverFetch<CategoryResponse>(url);
  }

  async getCategoryById(id: string): Promise<{ message: string; data: Category }> {
    return serverFetch<{ message: string; data: Category }>(`${CATALOG_SERVICE}/categories/${id}`);
  }
}

export const categoryServiceServer = new CategoryServiceServer();
