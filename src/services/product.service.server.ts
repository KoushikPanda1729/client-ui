import "server-only";

import { serverFetch } from "@/lib/fetch-server";
import { CATALOG_SERVICE } from "@/config/apiConfig";
import { ProductResponse, Product } from "./product.service";

/**
 * SERVER-ONLY Service - Do not import in Client Components!
 * This service is for Server Components and Server Actions only.
 * For client-side, use product.service.ts instead.
 */
class ProductServiceServer {
  async getProducts(
    page: number = 1,
    limit: number = 10,
    tenantId?: string
  ): Promise<ProductResponse> {
    let url = `${CATALOG_SERVICE}/products?page=${page}&limit=${limit}`;

    if (tenantId) {
      url += `&tenantId=${tenantId}`;
    }

    return serverFetch<ProductResponse>(url);
  }

  async getProductById(id: string): Promise<{ message: string; data: Product }> {
    return serverFetch<{ message: string; data: Product }>(`${CATALOG_SERVICE}/products/${id}`);
  }
}

export const productServiceServer = new ProductServiceServer();
