import "server-only";

import { serverFetch } from "@/lib/fetch-server";
import { CATALOG_SERVICE } from "@/config/apiConfig";
import { ToppingResponse, Topping } from "./topping.service";

/**
 * SERVER-ONLY Service - Do not import in Client Components!
 * This service is for Server Components and Server Actions only.
 * For client-side, use topping.service.ts instead.
 */
class ToppingServiceServer {
  async getToppings(
    page: number = 1,
    limit: number = 10,
    tenantId?: string
  ): Promise<ToppingResponse> {
    let url = `${CATALOG_SERVICE}/toppings?page=${page}&limit=${limit}`;

    if (tenantId) {
      url += `&tenantId=${tenantId}`;
    }

    return serverFetch<ToppingResponse>(url);
  }

  async getToppingById(id: string): Promise<{ message: string; data: Topping }> {
    return serverFetch<{ message: string; data: Topping }>(`${CATALOG_SERVICE}/toppings/${id}`);
  }
}

export const toppingServiceServer = new ToppingServiceServer();
