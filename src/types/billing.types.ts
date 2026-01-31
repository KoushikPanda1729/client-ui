export interface CustomerAddress {
  _id: string;
  text: string;
  isDefault: boolean;
}

export interface Customer {
  _id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  address: CustomerAddress[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateCustomerResponse {
  message: string;
  customer: Customer;
}

export interface GetCustomerResponse {
  message: string;
  customer: Customer;
}

export interface AddAddressPayload {
  text: string;
  isDefault: boolean;
}

export interface UpdateAddressPayload {
  text: string;
  isDefault: boolean;
}

export interface AddressResponse {
  message: string;
  customer: Customer;
}

// Order types
export interface CreateOrderItemTopping {
  _id: string;
  name: string;
  image: string;
  price: number;
}

export interface CreateOrderItem {
  _id: string;
  name: string;
  image: string;
  qty: number;
  priceConfiguration: Record<string, string>;
  toppings: CreateOrderItemTopping[];
  totalPrice: number;
}

export interface CreateOrderPayload {
  address: string;
  items: CreateOrderItem[];
  couponCode?: string;
  discount?: number;
  taxTotal?: number;
  deliveryCharge?: number;
  total: number;
  finalTotal: number; // Total after wallet credit deduction
  paymentMode: string;
  tenantId: string;
  walletCredits?: number; // Wallet credits used for this order
}

export interface OrderTax {
  name: string;
  rate: number;
  amount: number;
}

export interface OrderResponse {
  customerId: string;
  address: string;
  items: CreateOrderItem[];
  subTotal: number;
  couponCode?: string;
  discount: number;
  deliveryCharge: number;
  taxes: OrderTax[];
  taxTotal: number;
  total: number;
  paymentMode: string;
  paymentStatus: string;
  status: string;
  tenantId: string;
  _id: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateOrderResponse {
  message: string;
  order: OrderResponse;
}

// Tax types
export interface TaxItem {
  name: string;
  rate: number;
  isActive: boolean;
}

export interface TaxConfig {
  _id: string;
  tenantId: string;
  taxes: TaxItem[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetTaxConfigResponse {
  message: string;
  taxConfig: TaxConfig;
}

// Delivery types
export interface DeliveryTier {
  minOrderValue: number;
  deliveryCharge: number;
}

export interface CalculateDeliveryResponse {
  message: string;
  deliveryCharge: number;
  isFreeDelivery: boolean;
  freeDeliveryReason?: "tier" | "threshold";
  appliedTier?: DeliveryTier;
}

// Payment types
export interface InitiatePaymentPayload {
  orderId: string;
  currency: string;
}

export interface PaymentDetails {
  id: string;
  amount: number;
  currency: string;
  status: string;
  gatewayOrderId: string;
  paymentUrl: string;
  receipt: string;
}

export interface InitiatePaymentResponse {
  message: string;
  payment: PaymentDetails;
}

export interface PaymentSessionDetails {
  id: string;
  object: string;
  amount_total: number;
  currency: string;
  payment_status: string;
  status: string;
  customer_details: {
    email: string;
    name: string;
  } | null;
  metadata: {
    customerId: string;
    orderId: string;
    receipt: string;
    tenantId: string;
  };
}

export interface GetPaymentDetailsResponse {
  message: string;
  payment: PaymentSessionDetails;
}

// Order list types
export interface OrderItemTopping {
  _id: string;
  name: string;
  image: string;
  price: number;
}

export interface OrderItem {
  _id: string;
  name: string;
  image: string;
  qty: number;
  priceConfiguration: Record<string, string>;
  toppings: OrderItemTopping[];
  totalPrice: number;
}

export interface Order {
  _id: string;
  customerId: string;
  address: string;
  items: OrderItem[];
  subTotal: number;
  couponCode?: string;
  discount: number;
  deliveryCharge: number;
  taxes: OrderTax[];
  taxTotal: number;
  total: number;
  walletCreditsApplied?: number;
  finalTotal: number;
  paymentMode: string;
  paymentStatus: string;
  status: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  paymentId?: string;
}

export interface GetMyOrdersResponse {
  message: string;
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetOrderDetailResponse {
  message: string;
  order: Order;
}

// Refund types
export interface RefundDetails {
  id: string;
  paymentId: string;
  amount: number;
  status: string;
}

export interface GetRefundsResponse {
  message: string;
  refunds: RefundDetails[];
}

// Cancel order types
export interface UpdateOrderStatusPayload {
  status: string;
}

export interface UpdateOrderStatusResponse {
  message: string;
  order: Order;
}
