import { AUTH_SERVICE, BILLING_SERVICE, KONG_GATEWAY_URL, USER_SERVICE } from "@/config/apiConfig";

export const API_BASE_URL = KONG_GATEWAY_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${AUTH_SERVICE}/auth/login`,
    REGISTER: `${AUTH_SERVICE}/auth/register`,
    LOGOUT: `${AUTH_SERVICE}/auth/logout`,
    REFRESH: `${AUTH_SERVICE}/auth/refresh`,
    SELF: `${AUTH_SERVICE}/auth/self`,
    GET_ACCESS_TOKEN: `/api/auth/accessToken`,
  },
  USERS: {
    LIST: `${USER_SERVICE}/users`,
    DETAIL: (id: number) => `${USER_SERVICE}/users/${id}`,
    UPDATE: (id: number) => `${USER_SERVICE}/users/${id}`,
    DELETE: (id: number) => `${USER_SERVICE}/users/${id}`,
  },
  BILLING: {
    CUSTOMERS: `${BILLING_SERVICE}/customers`,
    CUSTOMER_DETAIL: (customerId: string) => `${BILLING_SERVICE}/customers/${customerId}`,
    CUSTOMER_BY_USER: (userId: string) => `${BILLING_SERVICE}/customers/${userId}`,
    ADD_ADDRESS: (customerId: string) => `${BILLING_SERVICE}/customers/${customerId}/addresses`,
    UPDATE_ADDRESS: (customerId: string, addressId: string) =>
      `${BILLING_SERVICE}/customers/${customerId}/addresses/${addressId}`,
    DELETE_ADDRESS: (customerId: string, addressId: string) =>
      `${BILLING_SERVICE}/customers/${customerId}/addresses/${addressId}`,
  },
  ORDERS: {
    CREATE: `${BILLING_SERVICE}/orders`,
    MY_ORDERS: `${BILLING_SERVICE}/orders/my-orders`,
    DETAIL: (orderId: string) => `${BILLING_SERVICE}/orders/${orderId}`,
    UPDATE_STATUS: (orderId: string) => `${BILLING_SERVICE}/orders/${orderId}/status`,
  },
  PAYMENTS: {
    INITIATE: `${BILLING_SERVICE}/payments/initiate`,
    GET_DETAILS: (sessionId: string) => `${BILLING_SERVICE}/payments/${sessionId}`,
    GET_REFUNDS: (orderId: string) => `${BILLING_SERVICE}/payments/refunds/${orderId}`,
  },
  TAXES: {
    GET: (tenantId: string) => `${BILLING_SERVICE}/taxes?tenantId=${tenantId}`,
  },
  DELIVERY: {
    CALCULATE: (tenantId: string, orderSubTotal: number) =>
      `${BILLING_SERVICE}/delivery/calculate?tenantId=${tenantId}&orderSubTotal=${orderSubTotal}`,
  },
  COUPONS: {
    LIST: (page: number, limit: number, tenantId: number) =>
      `${BILLING_SERVICE}/coupons?page=${page}&limit=${limit}&tenantId=${tenantId}`,
    VERIFY: `${BILLING_SERVICE}/coupons/verify`,
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  HOME: "/",
  PROFILE: "/profile",
} as const;

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
