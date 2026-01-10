"use client";

import { RegisterForm } from "@/components/features/auth/RegisterForm";
import { PublicRoute } from "@/components/auth";
import Link from "next/link";
import { PhoneOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Select } from "antd";
import Image from "next/image";

const { Option } = Select;

export default function RegisterPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen bg-[#F5F1ED]">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#FF6B35] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">pizza</span>
              </Link>

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
                <Link href="/#menu" className="text-gray-700 hover:text-gray-900 font-medium">
                  Menu
                </Link>
                <Link href="/#orders" className="text-gray-700 hover:text-gray-900 font-medium">
                  Orders
                </Link>
              </nav>

              {/* Cart and Phone */}
              <div className="flex items-center gap-3 sm:gap-4">
                <ShoppingCartOutlined className="text-xl sm:text-2xl text-gray-700 cursor-pointer" />
                <a
                  href="tel:+919800098998"
                  className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-[#FF6B35] transition-colors"
                >
                  <PhoneOutlined />
                  <span className="hidden md:inline text-sm lg:text-base">+91 9800 098 998</span>
                </a>
              </div>
            </div>
          </div>
        </header>

        {/* Split Layout */}
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
          {/* Image Side */}
          <div className="hidden lg:flex lg:w-1/2 bg-white items-center justify-center p-12">
            <div className="max-w-2xl">
              <Image
                src="/image/pizza_image.png"
                alt="Delicious Pizza"
                width={700}
                height={700}
                className="w-full h-auto mix-blend-multiply"
                priority
              />
            </div>
          </div>

          {/* Form Side */}
          <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
                <p className="mt-2 text-sm text-gray-600">Sign up for a new account</p>
              </div>
              <RegisterForm />
              <div className="text-center text-sm">
                <span className="text-gray-600">Already have an account? </span>
                <Link href="/login" className="font-medium text-[#FF6B35] hover:text-[#FF5520]">
                  Login here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
}
