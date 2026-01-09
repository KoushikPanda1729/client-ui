"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { ProtectedRoute } from "@/components/auth";
import { Button, Card, Tag } from "antd";
import { LogoutOutlined } from "@ant-design/icons";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/login");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Card>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Button onClick={handleLogout} icon={<LogoutOutlined />}>
                  Logout
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Welcome, {user?.firstName}!</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">ID:</span> {user?.id}
                    </div>
                    <div>
                      <span className="font-medium">Email:</span> {user?.email}
                    </div>
                    <div>
                      <span className="font-medium">Name:</span> {user?.firstName} {user?.lastName}
                    </div>
                    <div>
                      <span className="font-medium">Role:</span>{" "}
                      <Tag color="blue">{user?.role}</Tag>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
