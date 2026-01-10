"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Select, Input, Badge, Dropdown, Avatar } from "antd";
import type { MenuProps } from "antd";
import {
  EnvironmentOutlined,
  CheckCircleFilled,
  PlusOutlined,
  ShoppingCartOutlined,
  PhoneOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import Link from "next/link";
import type { Address } from "@/types/cart.types";

const { Option } = Select;

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [paymentType, setPaymentType] = useState<"COD" | "Online">("COD");
  const [couponCode, setCouponCode] = useState("");

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

  const addresses: Address[] = [
    {
      id: 1,
      name: "Rakesh K",
      street: "Main street, Big, no. 3",
      building: "Ground floor",
      apartment: "apt. 4",
      isDefault: true,
    },
    {
      id: 2,
      name: "Rakesh K",
      street: "Naveen street,",
      building: "Big, no. 10 Ground floor",
      apartment: "apt. 12",
    },
  ];

  const subtotal = 4000;
  const taxes = 200;
  const deliveryCharges = 0;
  const total = subtotal + taxes + deliveryCharges;

  const handleCheckout = () => {
    // Handle checkout logic
    router.push("/orders");
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
              <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:border-[#FF6B35] transition-colors">
                <EnvironmentOutlined className="text-[#FF6B35]" />
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
              <Badge count={4} showZero={false} color="#FF6B35">
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
              <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg w-fit">
                <EnvironmentOutlined className="text-[#FF6B35]" />
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Address, Restaurant, Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all relative ${
                      selectedAddressId === address.id
                        ? "border-[#FF6B35] bg-white"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    {selectedAddressId === address.id && (
                      <CheckCircleFilled className="absolute top-3 right-3 text-[#FF6B35] text-xl" />
                    )}
                    <h3 className="font-semibold text-gray-900 mb-2">{address.name}</h3>
                    <p className="text-sm text-gray-600">{address.street}</p>
                    <p className="text-sm text-gray-600">
                      {address.building}, {address.apartment}
                    </p>
                  </div>
                ))}

                {/* Add Address Button */}
                <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#FF6B35] transition-colors flex flex-col items-center justify-center gap-2 min-h-[120px]">
                  <PlusOutlined className="text-2xl text-gray-400" />
                  <span className="text-gray-600 font-medium">Add address</span>
                </button>
              </div>
            </div>

            {/* Restaurant Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Restaurant</h2>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900">Pizzarea</h3>
                <p className="text-sm text-gray-600">Shopping mall,</p>
                <p className="text-sm text-gray-600">2nd floor</p>
              </div>
            </div>

            {/* Payment Type Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment type</h2>
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setPaymentType("COD")}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all relative ${
                    paymentType === "COD"
                      ? "border-[#FF6B35] bg-white"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  {paymentType === "COD" && (
                    <CheckCircleFilled className="absolute top-3 right-3 text-[#FF6B35] text-xl" />
                  )}
                  <p className="font-semibold text-gray-900">COD</p>
                </div>
                <div
                  onClick={() => setPaymentType("Online")}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentType === "Online"
                      ? "border-[#FF6B35] bg-white"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold text-gray-900">Online</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Taxes</span>
                  <span className="font-semibold">₹{taxes}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Delivery charges</span>
                  <span className="font-semibold">₹{deliveryCharges}</span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Order total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Coupon Code */}
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="Coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1"
                />
                <button className="px-6 bg-[#FF6B35] hover:bg-[#FF5520] text-white border-none rounded-lg transition-colors font-medium">
                  Apply
                </button>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-[#FF6B35] hover:bg-[#FF5520] text-white h-12 text-lg font-semibold rounded-lg transition-colors"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
