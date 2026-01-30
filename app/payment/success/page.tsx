"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircleFilled } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { clearCart } from "@/store/slices/cartSlice";
import { billingService } from "@/services/billing.service";
import type { PaymentSessionDetails } from "@/types/billing.types";
import Navbar from "@/components/layout/Navbar";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<PaymentSessionDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!sessionId) {
        setError("No session ID found");
        setLoading(false);
        return;
      }

      try {
        const response = await billingService.getPaymentDetails(sessionId);
        setPayment(response.payment);

        // Clear cart after successful payment
        if (response.payment.payment_status === "paid") {
          dispatch(clearCart());
        }
      } catch (err) {
        console.error("Error fetching payment details:", err);
        setError("Failed to fetch payment details");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [sessionId, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (error || !payment) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error || "Unable to verify payment"}</p>
          <button
            onClick={() => router.push("/")}
            className="bg-[#FF6B35] hover:bg-[#FF5520] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const isPaid = payment.payment_status === "paid";

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        {isPaid ? (
          <>
            <CheckCircleFilled className="text-green-500 text-6xl mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your order. Your payment has been processed successfully.
            </p>
          </>
        ) : (
          <>
            <div className="text-yellow-500 text-5xl mb-4">!</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Pending</h1>
            <p className="text-gray-600 mb-6">Your payment is being processed. Please wait...</p>
          </>
        )}

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Order ID</span>
            <span className="font-medium text-gray-900">{payment.metadata.orderId}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Amount</span>
            <span className="font-medium text-gray-900">
              {payment.currency.toUpperCase()} {(payment.amount_total / 100).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Status</span>
            <span className={`font-medium ${isPaid ? "text-green-600" : "text-yellow-600"}`}>
              {isPaid ? "Paid" : "Pending"}
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push("/orders")}
            className="flex-1 bg-[#FF6B35] hover:bg-[#FF5520] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            View Orders
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
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      <Navbar cartCount={0} />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B35] mx-auto mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        }
      >
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
