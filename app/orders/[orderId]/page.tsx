"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Tag, Steps, Badge, Dropdown, Avatar, Select } from "antd";
import type { MenuProps } from "antd";
import {
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  PhoneOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import type { Order } from "@/types/cart.types";

const { Option } = Select;

export default function OrderDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div className="px-2 py-1">
          <p className="font-semibold text-gray-900">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm text-gray-600">{user?.email}</p>
          <p className="text-xs text-gray-500 mt-1">Role: {user?.role}</p>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  // Mock order data - in real app, fetch based on resolvedParams.orderId
  const order: Order = {
    id: resolvedParams.orderId,
    items: [
      {
        id: 1,
        productId: 1,
        name: "Pepperoni Pizza",
        image: "/image/peperoni.png",
        size: "S",
        price: 299,
        quantity: 2,
      },
      {
        id: 2,
        productId: 2,
        name: "Margherita Pizza",
        image: "/image/peperoni.png",
        size: "M",
        price: 399,
        quantity: 1,
      },
      {
        id: 3,
        productId: 3,
        name: "Veggie Supreme",
        image: "/image/peperoni.png",
        size: "L",
        price: 499,
        quantity: 1,
      },
    ],
    subtotal: 1496,
    taxes: 149.6,
    deliveryCharges: 0,
    total: 1645.6,
    address: {
      id: 1,
      name: "Rakesh K",
      street: "Main street, Big, no. 3",
      building: "Ground floor",
      apartment: "apt. 4",
      isDefault: true,
    },
    restaurant: {
      name: "Pizzarea",
      location: "Shopping mall, 2nd floor",
    },
    paymentType: "COD",
    status: "Out for delivery",
    createdAt: "23.11.2022",
  };

  const getStatusColor = (status: Order["status"]) => {
    if (status === "Preparing") return "orange";
    if (status === "Delivered") return "green";
    if (status === "Cancelled") return "red";
    if (status === "Out for delivery") return "blue";
    return "default";
  };

  const getStatusStep = (status: Order["status"]) => {
    if (status === "Cancelled") return 0;
    if (status === "Preparing") return 0;
    if (status === "Out for delivery") return 1;
    if (status === "Delivered") return 2;
    return 0;
  };

  // Show loading or nothing while checking authentication
  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#FF6B35] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">pizza</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Select
                  defaultValue="mumbai"
                  variant="borderless"
                  style={{ width: 100 }}
                  suffixIcon={null}
                >
                  <Option value="mumbai">Mumbai</Option>
                  <Option value="delhi">Delhi</Option>
                  <Option value="bangalore">Bangalore</Option>
                </Select>
              </div>
              <Link href="/#menu" className="text-gray-700 hover:text-[#FF6B35] font-medium">
                Menu
              </Link>
              <button
                onClick={() => router.push("/orders")}
                className="text-gray-700 hover:text-[#FF6B35] font-medium"
              >
                Orders
              </button>
            </nav>

            {/* Cart, Phone, User Avatar and Mobile Menu */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Badge count={0} showZero={false} color="#FF6B35">
                <ShoppingCartOutlined
                  onClick={() => router.push("/cart")}
                  className="text-xl sm:text-2xl text-gray-700 cursor-pointer"
                />
              </Badge>
              <a
                href="tel:+919800098998"
                className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-[#FF6B35] transition-colors"
              >
                <PhoneOutlined />
                <span className="hidden md:inline text-sm lg:text-base">+91 9800 098 998</span>
              </a>
              {isAuthenticated ? (
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <div className="hidden lg:flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                    <Avatar
                      style={{ backgroundColor: "#FF6B35" }}
                      icon={<UserOutlined />}
                      size="default"
                    />
                    <div className="hidden xl:block text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-600">{user?.role}</p>
                    </div>
                  </div>
                </Dropdown>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="hidden lg:block text-gray-700 hover:text-gray-900 font-medium"
                >
                  Login
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-700 p-2"
              >
                {mobileMenuOpen ? (
                  <CloseOutlined className="text-xl" />
                ) : (
                  <MenuOutlined className="text-xl" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4 space-y-3">
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md w-fit">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <Select
                  defaultValue="mumbai"
                  variant="borderless"
                  style={{ width: 100 }}
                  suffixIcon={null}
                >
                  <Option value="mumbai">Mumbai</Option>
                  <Option value="delhi">Delhi</Option>
                  <Option value="bangalore">Bangalore</Option>
                </Select>
              </div>
              <Link
                href="/#menu"
                className="block py-2 text-gray-700 hover:text-[#FF6B35] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Menu
              </Link>
              <button
                onClick={() => {
                  router.push("/orders");
                  setMobileMenuOpen(false);
                }}
                className="block py-2 text-gray-700 hover:text-[#FF6B35] font-medium w-full text-left"
              >
                Orders
              </button>
              {isAuthenticated ? (
                <>
                  <div className="py-2 px-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar
                        style={{ backgroundColor: "#FF6B35" }}
                        icon={<UserOutlined />}
                        size="large"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                        <p className="text-xs text-gray-500">Role: {user?.role}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 py-2 text-red-600 hover:text-red-700 font-medium w-full text-left"
                  >
                    <LogoutOutlined />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    router.push("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="block py-2 text-gray-700 hover:text-[#FF6B35] font-medium w-full text-left"
                >
                  Login
                </button>
              )}
              <a
                href="tel:+919800098998"
                className="flex items-center gap-2 py-2 text-gray-700 hover:text-[#FF6B35] font-medium sm:hidden"
              >
                <PhoneOutlined />
                <span>+91 9800 098 998</span>
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Order Details</h1>
            <Tag color={getStatusColor(order.status)} className="text-base px-4 py-1 w-fit">
              {order.status}
            </Tag>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
            <p>
              <span className="font-semibold">Order ID:</span> {order.id}
            </p>
            <p>
              <span className="font-semibold">Order Date:</span> {order.createdAt}
            </p>
            <p>
              <span className="font-semibold">Payment:</span> {order.paymentType}
            </p>
          </div>
        </div>

        {/* Order Status Timeline */}
        {order.status !== "Cancelled" && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Status</h2>
            <Steps
              current={getStatusStep(order.status)}
              items={[
                {
                  title: "Preparing",
                  description: "Your order is being prepared",
                },
                {
                  title: "Out for delivery",
                  description: "Your order is on the way",
                },
                {
                  title: "Delivered",
                  description: "Order delivered successfully",
                },
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
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 pb-4 border-b last:border-b-0"
                  >
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={70}
                        height={70}
                        className="object-contain mix-blend-multiply"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Size: {item.size === "S" ? "Small" : item.size === "M" ? "Medium" : "Large"}
                      </p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">₹{item.price}</p>
                      <p className="text-sm text-gray-600">₹{item.price * item.quantity} total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
              <div className="text-gray-700">
                <p className="font-semibold text-gray-900">{order.address.name}</p>
                <p>{order.address.street}</p>
                <p>
                  {order.address.building}, {order.address.apartment}
                </p>
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Restaurant</h2>
              <div className="text-gray-700">
                <p className="font-semibold text-gray-900">{order.restaurant.name}</p>
                <p>{order.restaurant.location}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{order.subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Taxes</span>
                  <span className="font-semibold">₹{order.taxes}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery charges</span>
                  <span className="font-semibold">₹{order.deliveryCharges}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Order total</span>
                  <span>₹{order.total}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => router.push("/orders")}
                  className="w-full bg-[#FF6B35] hover:bg-[#FF5520] text-white h-12 text-base font-semibold rounded-lg transition-colors"
                >
                  Back to Orders
                </button>
                {order.status === "Delivered" && (
                  <button
                    onClick={() => router.push("/")}
                    className="w-full bg-white hover:bg-gray-50 border-2 border-gray-300 hover:border-[#FF6B35] text-gray-900 h-12 text-base font-semibold rounded-lg transition-colors"
                  >
                    Order Again
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
