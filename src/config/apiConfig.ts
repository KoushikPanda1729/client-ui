/**
 * Client-side Kong Gateway URL (exposed to browser)
 * Used by Client Components with axios
 */
export const KONG_GATEWAY_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

/**
 * Server-side Kong Gateway URL (NOT exposed to browser)
 * Used by Server Components with serverFetch
 */
export const KONG_GATEWAY_URL_SERVER = process.env.API_BASE_URL || "http://localhost:8000";

// API Routes - These are the service routes configured in Kong Gateway
export const AUTH_SERVICE = "/api/auth";
export const USER_SERVICE = "/api/user";
export const CATALOG_SERVICE = "/api/catalog";
export const BILLING_SERVICE = "/api/billing";
export const WS_SERVICE = "/api/socket";

// Calling service (WebRTC signaling) - direct connection, port 5505
export const CALLING_SERVICE_URL =
  process.env.NEXT_PUBLIC_CALLING_SERVICE_URL || "http://localhost:5505";

// Chat service - direct connection, port 5506
export const CHAT_SERVICE_URL = process.env.NEXT_PUBLIC_CHAT_SERVICE_URL || "http://localhost:5506";
