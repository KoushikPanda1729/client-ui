"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, Tag, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EyeOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { billingService } from "@/services/billing.service";
import type { Order } from "@/types/billing.types";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const pageSize = 10;
  const cartItemsCount = useSelector((state: RootState) => state.cart.items.length);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || loading) return;

      setOrdersLoading(true);
      try {
        const response = await billingService.getMyOrders(currentPage, pageSize);
        setOrders(response.data);
        setTotalOrders(response.total);
      } catch (error) {
        console.error("Error fetching orders:", error);
        message.error("Failed to load orders");
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, loading, currentPage]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "orange";
      case "confirmed":
        return "blue";
      case "preparing":
        return "cyan";
      case "out for delivery":
        return "purple";
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "default";
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "green";
      case "pending":
        return "orange";
      case "failed":
        return "red";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns: ColumnsType<Order> = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      render: (id: string) => (
        <Link href={`/orders/${id}`} className="text-blue-600 hover:text-blue-800 font-medium">
          #{id.slice(-8)}
        </Link>
      ),
    },
    {
      title: "Items",
      key: "items",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          <span>{record.items.length} item(s)</span>
          <span className="text-gray-500 text-sm">
            (
            {record.items
              .map((i) => i.name)
              .join(", ")
              .slice(0, 30)}
            {record.items.map((i) => i.name).join(", ").length > 30 ? "..." : ""})
          </span>
        </div>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (total: number) => <span className="font-semibold">₹{total.toFixed(2)}</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => formatDate(date),
    },
    {
      title: "Payment",
      key: "payment",
      render: (_, record) => (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 uppercase">{record.paymentMode}</span>
          <Tag color={getPaymentStatusColor(record.paymentStatus)}>{record.paymentStatus}</Tag>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={getStatusColor(status)} className="capitalize">
          {status}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_, record) => (
        <button
          onClick={() => router.push(`/orders/${record._id}`)}
          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
        >
          <EyeOutlined /> View
        </button>
      ),
    },
  ];

  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <Navbar cartCount={cartItemsCount} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table
            columns={columns}
            dataSource={orders}
            rowKey="_id"
            loading={ordersLoading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalOrders,
              showSizeChanger: false,
              showTotal: (total) => `Total ${total} orders`,
              onChange: (page) => setCurrentPage(page),
            }}
            locale={{
              emptyText: (
                <div className="py-12 text-center">
                  <p className="text-gray-500 mb-4">No orders yet</p>
                  <button
                    onClick={() => router.push("/")}
                    className="bg-[#FF6B35] hover:bg-[#FF5520] text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Start Shopping
                  </button>
                </div>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
}
