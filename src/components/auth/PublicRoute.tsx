"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Spin } from "antd";

interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const router = useRouter();
  const { authChecked, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (authChecked && isAuthenticated) {
      router.push("/");
    }
  }, [authChecked, isAuthenticated, router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Spin size="large" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, don't render the page content
  // (they'll be redirected by the useEffect)
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
