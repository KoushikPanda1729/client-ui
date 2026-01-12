import { apiService } from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
import {
  CreateCustomerResponse,
  GetCustomerResponse,
  AddAddressPayload,
  UpdateAddressPayload,
  AddressResponse,
} from "@/types/billing.types";

class BillingService {
  async createCustomer(): Promise<CreateCustomerResponse> {
    return apiService.post<CreateCustomerResponse>(API_ENDPOINTS.BILLING.CUSTOMERS, {});
  }

  async getCustomer(customerId: string): Promise<GetCustomerResponse> {
    return apiService.get<GetCustomerResponse>(API_ENDPOINTS.BILLING.CUSTOMER_DETAIL(customerId));
  }

  async ensureCustomerExists(userId: string): Promise<GetCustomerResponse> {
    try {
      // Step 1: Try to fetch existing customer by userId
      try {
        const customerResponse = await this.getCustomer(userId);
        return customerResponse;
      } catch {
        // Customer doesn't exist, proceed to create
        console.log("Customer not found, creating new customer");
      }

      // Step 2: Create customer (POST /customers with empty body, uses JWT)
      const createResponse = await this.createCustomer();
      const customerId = createResponse.customer._id;

      // Step 3: Fetch full customer details by customer_id
      const customerResponse = await this.getCustomer(customerId);
      return customerResponse;
    } catch (error: unknown) {
      console.error("Error ensuring customer exists:", error);
      throw error;
    }
  }

  async addAddress(customerId: string, payload: AddAddressPayload): Promise<AddressResponse> {
    return apiService.post<AddressResponse>(API_ENDPOINTS.BILLING.ADD_ADDRESS(customerId), payload);
  }

  async updateAddress(
    customerId: string,
    addressId: string,
    payload: UpdateAddressPayload
  ): Promise<AddressResponse> {
    return apiService.put<AddressResponse>(
      API_ENDPOINTS.BILLING.UPDATE_ADDRESS(customerId, addressId),
      payload
    );
  }

  async deleteAddress(customerId: string, addressId: string): Promise<AddressResponse> {
    return apiService.delete<AddressResponse>(
      API_ENDPOINTS.BILLING.DELETE_ADDRESS(customerId, addressId)
    );
  }
}

export const billingService = new BillingService();
