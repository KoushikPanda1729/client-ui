"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Spin } from "antd";

interface PublicRouteProps {
  children: ReactNode;
}

export function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, authChecked } = useAppSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (authChecked && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, authChecked, router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
