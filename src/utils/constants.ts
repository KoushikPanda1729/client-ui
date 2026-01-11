import { KONG_GATEWAY_URL, AUTH_SERVICE, USER_SERVICE } from "@/config/apiConfig";

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
