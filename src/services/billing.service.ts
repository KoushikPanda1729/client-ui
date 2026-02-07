import { apiService } from "./api";
import { API_ENDPOINTS } from "@/utils/constants";
import {
  CreateCustomerResponse,
  GetCustomerResponse,
  AddAddressPayload,
  UpdateAddressPayload,
  AddressResponse,
  CreateOrderPayload,
  CreateOrderResponse,
  GetTaxConfigResponse,
  CalculateDeliveryResponse,
  InitiatePaymentPayload,
  InitiatePaymentResponse,
  GetPaymentDetailsResponse,
  GetMyOrdersResponse,
  GetOrderDetailResponse,
  GetRefundsResponse,
  UpdateOrderStatusPayload,
  UpdateOrderStatusResponse,
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

  async getTaxConfig(tenantId: string): Promise<GetTaxConfigResponse> {
    return apiService.get<GetTaxConfigResponse>(API_ENDPOINTS.TAXES.GET(tenantId));
  }

  async calculateDeliveryCharge(
    tenantId: string,
    orderSubTotal: number
  ): Promise<CalculateDeliveryResponse> {
    return apiService.get<CalculateDeliveryResponse>(
      API_ENDPOINTS.DELIVERY.CALCULATE(tenantId, orderSubTotal)
    );
  }

  async createOrder(payload: CreateOrderPayload, userId: string): Promise<CreateOrderResponse> {
    const idempotencyKey = `${userId}-${crypto.randomUUID()}`;
    return apiService.post<CreateOrderResponse>(API_ENDPOINTS.ORDERS.CREATE, payload, {
      headers: {
        "x-idempotency-key": idempotencyKey,
      },
    });
  }

  async initiatePayment(
    payload: InitiatePaymentPayload,
    idempotencyKey: string
  ): Promise<InitiatePaymentResponse> {
    return apiService.post<InitiatePaymentResponse>(API_ENDPOINTS.PAYMENTS.INITIATE, payload, {
      headers: {
        "x-idempotency-key": idempotencyKey,
      },
    });
  }

  async getPaymentDetails(sessionId: string): Promise<GetPaymentDetailsResponse> {
    return apiService.get<GetPaymentDetailsResponse>(API_ENDPOINTS.PAYMENTS.GET_DETAILS(sessionId));
  }

  async getMyOrders(page: number = 1, limit: number = 10): Promise<GetMyOrdersResponse> {
    return apiService.get<GetMyOrdersResponse>(
      `${API_ENDPOINTS.ORDERS.MY_ORDERS}?page=${page}&limit=${limit}`
    );
  }

  async getOrderDetail(orderId: string): Promise<GetOrderDetailResponse> {
    return apiService.get<GetOrderDetailResponse>(API_ENDPOINTS.ORDERS.DETAIL(orderId));
  }

  async getRefunds(orderId: string): Promise<GetRefundsResponse> {
    return apiService.get<GetRefundsResponse>(API_ENDPOINTS.PAYMENTS.GET_REFUNDS(orderId));
  }

  async cancelOrder(
    orderId: string,
    payload: UpdateOrderStatusPayload
  ): Promise<UpdateOrderStatusResponse> {
    return apiService.patch<UpdateOrderStatusResponse>(
      API_ENDPOINTS.ORDERS.UPDATE_STATUS(orderId),
      payload
    );
  }
}

export const billingService = new BillingService();
