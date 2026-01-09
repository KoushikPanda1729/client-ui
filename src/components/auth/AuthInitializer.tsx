"use client";

import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { fetchProfile } from "@/store/slices/authSlice";

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Always try to restore session by calling /self endpoint
    // If cookies are valid, user will be authenticated
    // If not, it will fail silently and user stays unauthenticated
    dispatch(fetchProfile()).finally(() => setInitialized(true));
  }, [dispatch]);

  // Don't render children until auth is initialized
  if (!initialized) {
    return null;
  }

  return <>{children}</>;
}
