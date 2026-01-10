"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchProfile } from "@/store/slices/authSlice";
import { Spin } from "antd";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Always try to restore session by calling /self endpoint
    // If cookies are valid, user will be authenticated
    // If not, it will fail silently and user stays unauthenticated
    dispatch(fetchProfile()).finally(() => setInitialized(true));
  }, [dispatch]);

  // Show loading screen while auth is being initialized
  if (!initialized) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
