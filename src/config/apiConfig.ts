// Kong Gateway URL - uses environment variable or defaults to localhost:8000
export const KONG_GATEWAY_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// API Routes - These are the service routes configured in Kong Gateway
export const AUTH_SERVICE = "/api/auth";
export const USER_SERVICE = "/api/user";
export const CATALOG_SERVICE = "/api/catalog";
