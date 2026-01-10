"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "antd";
import { CheckCircleFilled, PlusOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import type { Address } from "@/types/cart.types";

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [selectedAddressId, setSelectedAddressId] = useState(1);
  const [paymentType, setPaymentType] = useState<"COD" | "Online">("COD");
  const [couponCode, setCouponCode] = useState("");

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
      <Navbar cartCount={4} />

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
