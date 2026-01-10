"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Select, Badge, Dropdown, Avatar } from "antd";
import type { MenuProps } from "antd";
import {
  ShoppingCartOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  MenuOutlined,
  CloseOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Option } = Select;

interface NavbarProps {
  cartCount?: number;
}

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
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

  return (
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
            <Badge count={cartCount} showZero={false} color="#FF6B35">
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
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={["click"]}>
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
  );
}
