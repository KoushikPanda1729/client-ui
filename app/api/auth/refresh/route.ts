import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { KONG_GATEWAY_URL_SERVER, AUTH_SERVICE } from "@/config/apiConfig";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken");
    const refreshToken = cookieStore.get("refreshToken");

    if (!refreshToken) {
      return NextResponse.json({ error: "No refresh token" }, { status: 401 });
    }

    // Call backend auth-service's /refresh endpoint
    const response = await fetch(`${KONG_GATEWAY_URL_SERVER}${AUTH_SERVICE}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessToken?.value || ""}; refreshToken=${refreshToken.value}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Refresh failed" }, { status: response.status });
    }

    // Extract new cookies from backend response
    const setCookieHeaders = response.headers.getSetCookie();

    // Create Next.js response
    const nextResponse = NextResponse.json({ success: true });

    // Forward cookies from backend to client
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie) => {
        nextResponse.headers.append("Set-Cookie", cookie);
      });
    }

    return nextResponse;
  } catch (error) {
    console.error("[API] Refresh error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
