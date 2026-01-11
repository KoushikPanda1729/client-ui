import "server-only";

import { cookies } from "next/headers";
import { API_BASE_URL } from "@/utils/constants";

/**
 * SERVER-ONLY fetch utility for Next.js Server Components and Server Actions
 * Reads cookies from the request and forwards them to the backend
 * Do not import this in Client Components!
 */
export async function serverFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      // Forward cookies from the browser to the backend
      ...(cookieHeader && { Cookie: cookieHeader }),
      ...options?.headers,
    },
    // Disable Next.js caching for dynamic data
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData?.message || `HTTP error! status: ${response.status}`;
    throw {
      message: errorMessage,
      statusCode: response.status,
      errors: errorData?.errors,
    };
  }

  return response.json();
}
