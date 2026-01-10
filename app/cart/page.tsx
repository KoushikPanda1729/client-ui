"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Select, Badge, Dropdown, Avatar } from "antd";
import type { MenuProps } from "antd";
import {
  CloseOutlined,
  EnvironmentOutlined,
  ShoppingCartOutlined,
  PhoneOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import type { CartItem } from "@/types/cart.types";

const { Option } = Select;

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      productId: 1,
      name: "Pepperoni Pizza",
      image: "/image/peperoni.png",
      size: "S",
      price: 299,
      quantity: 1,
    },
    {
      id: 2,
      productId: 1,
      name: "Pepperoni Pizza",
      image: "/image/peperoni.png",
      size: "S",
      price: 299,
      quantity: 1,
    },
    {
      id: 3,
      productId: 1,
      name: "Pepperoni Pizza",
      image: "/image/peperoni.png",
      size: "S",
      price: 299,
      quantity: 1,
    },
    {
      id: 4,
      productId: 1,
      name: "Pepperoni Pizza",
      image: "/image/peperoni.png",
      size: "S",
      price: 299,
      quantity: 1,
    },
  ]);

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

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveItem = (itemId: number) => {
    setCartItems((items) => items.filter((item) => item.id !== itemId));
  };

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

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
              <Link href="/menu" className="text-gray-700 hover:text-[#FF6B35] font-medium">
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
              <Badge count={cartItems.length} showZero={false} color="#FF6B35">
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
                href="/menu"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
            Shopping Cart
          </h1>
          <p className="text-gray-600 mt-2">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 lg:p-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingOutlined className="text-4xl sm:text-5xl text-gray-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-6 sm:mb-8">
                Looks like you haven&apos;t added any items to your cart yet.
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-[#FF6B35] hover:bg-[#FF5520] text-white px-8 py-3 rounded-lg text-base sm:text-lg font-semibold transition-colors shadow-sm"
              >
                Start Shopping
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items - Left Side */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image */}
                      <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={120}
                          height={120}
                          className="object-contain mix-blend-multiply"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-1 truncate">
                              {item.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Classic |{" "}
                              {item.size === "S" ? "Small" : item.size === "M" ? "Medium" : "Large"}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 -mt-2 -mr-2"
                            aria-label="Remove item"
                          >
                            <DeleteOutlined className="text-xl" />
                          </button>
                        </div>

                        {/* Price and Quantity - Mobile & Desktop */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          {/* Price */}
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-[#FF6B35]">
                              ₹{item.price * item.quantity}
                            </span>
                            <span className="text-sm text-gray-500">₹{item.price} each</span>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-600 font-medium">Quantity:</span>
                            <div className="flex items-center border-2 border-gray-200 rounded-lg">
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.id, Math.max(1, item.quantity - 1))
                                }
                                disabled={item.quantity <= 1}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Decrease quantity"
                              >
                                <MinusOutlined />
                              </button>
                              <div className="w-12 h-10 flex items-center justify-center border-x-2 border-gray-200 font-semibold text-gray-900">
                                {item.quantity}
                              </div>
                              <button
                                onClick={() =>
                                  handleQuantityChange(item.id, Math.min(10, item.quantity + 1))
                                }
                                disabled={item.quantity >= 10}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                aria-label="Increase quantity"
                              >
                                <PlusOutlined />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping Button - Mobile */}
              <button
                onClick={() => router.push("/")}
                className="lg:hidden w-full bg-white border-2 border-gray-300 hover:border-[#FF6B35] text-gray-900 h-12 text-base font-semibold rounded-lg transition-colors"
              >
                Continue Shopping
              </button>
            </div>

            {/* Order Summary - Right Side */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>
                      Subtotal ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
                    </span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Delivery</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-[#FF6B35]">₹{subtotal}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-[#FF6B35] hover:bg-[#FF5520] text-white h-12 text-lg font-semibold rounded-lg transition-colors shadow-sm mb-3"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => router.push("/")}
                  className="hidden lg:block w-full bg-white border-2 border-gray-300 hover:border-[#FF6B35] text-gray-900 h-12 text-base font-semibold rounded-lg transition-colors"
                >
                  Continue Shopping
                </button>

                {/* Secure Checkout Badge */}
                <div className="mt-6 pt-6 border-t text-center">
                  <p className="text-xs text-gray-500">🔒 Secure Checkout • Safe Payment</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
