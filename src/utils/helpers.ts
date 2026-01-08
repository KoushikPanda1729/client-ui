import { USER_KEY } from "./constants";
import { User } from "@/types/user.types";

// User data helpers (non-sensitive data stored in localStorage)
export const getStoredUser = (): User | null => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? (JSON.parse(user) as User) : null;
};

export const setStoredUser = (user: User): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeStoredUser = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
};

export const clearAuth = (): void => {
  // Only clear localStorage user data
  // HTTP-only cookies are cleared by the backend on logout
  removeStoredUser();
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str: string, length: number): string => {
  return str.length > length ? `${str.substring(0, length)}...` : str;
};
