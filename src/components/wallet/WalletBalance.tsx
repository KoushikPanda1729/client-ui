"use client";

import { useWallet } from "@/hooks/useWallet";
import { WalletOutlined, LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";

export function WalletBalance() {
  const { wallet, loading, error } = useWallet();

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 text-gray-600">
        <Spin indicator={<LoadingOutlined spin />} size="small" />
        <span className="text-sm">Loading...</span>
      </div>
    );
  }

  if (error || !wallet) {
    return null; // Silently hide if error or not authenticated
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
      <WalletOutlined className="text-green-600 text-lg" />
      <div className="flex flex-col">
        <span className="text-xs text-gray-600">Wallet Balance</span>
        <span className="text-sm font-semibold text-green-700">
          {wallet.currency === "INR" ? "₹" : wallet.currency} {wallet.balance.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
