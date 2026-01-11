"use client";

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { decodeJwt } from "jose";

const REFRESH_BUFFER_MS = 5000; // Refresh 5 seconds before expiry

export const useTokenRefresh = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      // Clear timer on logout
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      return;
    }

    const startRefresh = async (): Promise<void> => {
      try {
        // Clear any existing timer
        if (refreshTimerRef.current) {
          clearTimeout(refreshTimerRef.current);
          refreshTimerRef.current = null;
        }

        // Fetch access token from cookie (via Next.js API)
        const response = await fetch("/api/auth/accessToken");

        if (!response.ok) {
          console.warn("[useTokenRefresh] No access token found");
          return;
        }

        const { accessToken } = await response.json();

        // Decode token to get expiry
        const decoded = decodeJwt(accessToken);
        const exp = decoded.exp;

        if (!exp) {
          console.error("[useTokenRefresh] Token has no expiry");
          return;
        }

        // Calculate time until expiry
        const expiryMs = exp * 1000;
        const nowMs = Date.now();
        const timeUntilExpiry = expiryMs - nowMs;

        if (timeUntilExpiry <= 0) {
          console.warn("[useTokenRefresh] Token already expired, refreshing immediately");
          await refreshAccessToken();
          return;
        }

        // Schedule refresh before expiry (with safety margin)
        const refreshIn = Math.max(0, timeUntilExpiry - REFRESH_BUFFER_MS);

        console.log(
          `[useTokenRefresh] Token expires in ${Math.round(timeUntilExpiry / 1000)}s, ` +
            `refreshing in ${Math.round(refreshIn / 1000)}s`
        );

        refreshTimerRef.current = setTimeout(() => {
          void refreshAccessToken();
        }, refreshIn);
      } catch (error) {
        console.error("[useTokenRefresh] Failed to start refresh:", error);
      }
    };

    const refreshAccessToken = async (): Promise<void> => {
      try {
        console.log("[useTokenRefresh] Refreshing access token...");

        // Call Next.js API refresh endpoint (which proxies to backend)
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          console.error("[useTokenRefresh] Refresh failed");
          return;
        }

        console.log("[useTokenRefresh] Token refreshed successfully");

        // Re-schedule next refresh
        await startRefresh();
      } catch (error) {
        console.error("[useTokenRefresh] Refresh error:", error);
      }
    };

    // Start the refresh cycle
    void startRefresh();

    // Cleanup on unmount
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [isAuthenticated]);
};
