"use client";

import { useRouter } from "next/navigation";
import { CloseCircleFilled } from "@ant-design/icons";
import Navbar from "@/components/layout/Navbar";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function PaymentCancelPage() {
  const router = useRouter();
  const cartItemsCount = useSelector((state: RootState) => state.cart.items.length);

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <Navbar cartCount={cartItemsCount} />
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
          <CloseCircleFilled className="text-red-500 text-6xl mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h1>
          <p className="text-gray-600 mb-6">
            Your payment was cancelled. Don&apos;t worry, your cart items are still saved.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/checkout")}
              className="flex-1 bg-[#FF6B35] hover:bg-[#FF5520] text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/")}
              className="flex-1 border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
