"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Tag, Steps, message, Modal } from "antd";
import { ArrowLeftOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { billingService } from "@/services/billing.service";
import type { Order, RefundDetails } from "@/types/billing.types";
import Navbar from "@/components/layout/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [refunds, setRefunds] = useState<RefundDetails[]>([]);
  const [refundsLoading, setRefundsLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const cartItemsCount = useSelector((state: RootState) => state.cart.items.length);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated || loading || !resolvedParams.orderId) return;

      try {
        const response = await billingService.getOrderDetail(resolvedParams.orderId);
        setOrder(response.order);
      } catch (error) {
        console.error("Error fetching order:", error);
        message.error("Failed to load order details");
      } finally {
        setOrderLoading(false);
      }
    };

    fetchOrder();
  }, [isAuthenticated, loading, resolvedParams.orderId]);

  useEffect(() => {
    const fetchRefunds = async () => {
      if (!isAuthenticated || loading || !resolvedParams.orderId) return;

      try {
        const response = await billingService.getRefunds(resolvedParams.orderId);
        setRefunds(response.refunds);
      } catch (error) {
        console.error("Error fetching refunds:", error);
        // Don't show error message as refunds might not exist for all orders
      } finally {
        setRefundsLoading(false);
      }
    };

    fetchRefunds();
  }, [isAuthenticated, loading, resolvedParams.orderId]);

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

  const getRefundStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "succeeded":
        return "green";
      case "pending":
        return "orange";
      case "failed":
        return "red";
      default:
        return "default";
    }
  };

  const getStatusStep = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return 0;
      case "confirmed":
        return 1;
      case "preparing":
        return 2;
      case "out for delivery":
        return 3;
      case "delivered":
        return 4;
      default:
        return 0;
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;

    Modal.confirm({
      title: "Cancel Order",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure you want to cancel this order? This action cannot be undone.",
      okText: "Yes, Cancel Order",
      cancelText: "No, Keep Order",
      okButtonProps: {
        danger: true,
      },
      onOk: async () => {
        setCancelling(true);
        try {
          const response = await billingService.cancelOrder(resolvedParams.orderId, {
            status: "cancelled",
          });
          setOrder(response.order);
          message.success("Order cancelled successfully");
        } catch (error) {
          console.error("Error cancelling order:", error);
          message.error("Failed to cancel order. Please try again.");
        } finally {
          setCancelling(false);
        }
      },
    });
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

  if (loading || !isAuthenticated) {
    return null;
  }

  if (orderLoading) {
    return (
      <div className="min-h-screen bg-[#F5F1ED]">
        <Navbar cartCount={cartItemsCount} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F5F1ED]">
        <Navbar cartCount={cartItemsCount} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h1>
            <p className="text-gray-600 mb-6">
              The order you&apos;re looking for doesn&apos;t exist.
            </p>
            <button
              onClick={() => router.push("/orders")}
              className="bg-[#FF6B35] hover:bg-[#FF5520] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <Navbar cartCount={cartItemsCount} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/orders")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeftOutlined /> Back to Orders
        </button>

        {/* Order Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <div className="flex items-center gap-2">
              <Tag color={getStatusColor(order.status)} className="text-base px-4 py-1">
                {order.status}
              </Tag>
              <Tag
                color={getPaymentStatusColor(order.paymentStatus)}
                className="text-base px-4 py-1"
              >
                {order.paymentStatus}
              </Tag>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
            <p>
              <span className="font-semibold">Order ID:</span> #{order._id.slice(-8)}
            </p>
            <p>
              <span className="font-semibold">Order Date:</span> {formatDate(order.createdAt)}
            </p>
            <p>
              <span className="font-semibold">Payment:</span> {order.paymentMode.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Order Status Timeline */}
        {order.status.toLowerCase() !== "cancelled" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
            <Steps
              current={getStatusStep(order.status)}
              items={[
                { title: "Pending", content: "Order placed" },
                { title: "Confirmed", content: "Order confirmed" },
                { title: "Preparing", content: "Being prepared" },
                { title: "Out for delivery", content: "On the way" },
                { title: "Delivered", content: "Delivered" },
              ]}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Order Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-b-0">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={70}
                        height={70}
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                      {item.toppings && item.toppings.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-500">Toppings:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.toppings.map((topping, tIndex) => (
                              <span
                                key={tIndex}
                                className="text-xs bg-gray-100 px-2 py-0.5 rounded"
                              >
                                {topping.name} (+₹{topping.price})
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{item.totalPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
              <div className="text-gray-700 whitespace-pre-line">{order.address}</div>
            </div>

            {/* Refund Details */}
            {!refundsLoading && refunds.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Refund Details</h2>
                <div className="space-y-4">
                  {refunds.map((refund, index) => (
                    <div
                      key={refund.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b last:border-b-0"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">Refund #{index + 1}</p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Payment ID:</span> {refund.paymentId}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-semibold">Refund ID:</span> {refund.id}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            ₹{(refund.amount / 100).toFixed(2)}
                          </p>
                        </div>
                        <Tag
                          color={getRefundStatusColor(refund.status)}
                          className="text-sm px-3 py-1"
                        >
                          {refund.status}
                        </Tag>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{order.subTotal}</span>
                </div>

                {order.taxes && order.taxes.length > 0 && (
                  <>
                    {order.taxes.map((tax, index) => (
                      <div key={index} className="flex justify-between text-gray-700">
                        <span>
                          {tax.name} ({tax.rate}%)
                        </span>
                        <span className="font-semibold">₹{tax.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </>
                )}

                <div className="flex justify-between text-gray-700">
                  <span>Delivery charges</span>
                  <span className="font-semibold">
                    {order.deliveryCharge === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${order.deliveryCharge}`
                    )}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                    <span className="font-semibold">-₹{order.discount}</span>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Order Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push("/orders")}
                  className="w-full bg-[#FF6B35] hover:bg-[#FF5520] text-white h-12 text-base font-semibold rounded-lg transition-colors"
                >
                  Back to Orders
                </button>
                {order.status.toLowerCase() === "delivered" && (
                  <button
                    onClick={() => router.push("/")}
                    className="w-full bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-[#FF6B35] text-gray-900 h-12 text-base font-semibold rounded-lg transition-colors"
                  >
                    Order Again
                  </button>
                )}
                {order.status.toLowerCase() !== "cancelled" &&
                  order.status.toLowerCase() !== "delivered" && (
                    <button
                      onClick={handleCancelOrder}
                      disabled={cancelling}
                      className="w-full bg-white hover:bg-red-50 border-2 border-red-300 hover:border-red-500 text-red-600 hover:text-red-700 h-12 text-base font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancelling ? "Cancelling..." : "Cancel Order"}
                    </button>
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
