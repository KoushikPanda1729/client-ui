"use client";

import { useState, useEffect } from "react";
import { Card, Checkbox, InputNumber, Slider, message, Spin } from "antd";
import { WalletOutlined, GiftOutlined } from "@ant-design/icons";
import { useWallet } from "@/hooks/useWallet";
import { walletApi } from "@/lib/api/wallet";

interface WalletSectionProps {
  orderTotal: number;
  onWalletAmountChange: (amount: number) => void;
}

export function WalletSection({ orderTotal, onWalletAmountChange }: WalletSectionProps) {
  const { wallet, loading: walletLoading } = useWallet();
  const [shouldUseWallet, setShouldUseWallet] = useState(false);
  const [walletAmount, setWalletAmount] = useState(0);
  const [cashbackPreview, setCashbackPreview] = useState(0);
  const [loadingCashback, setLoadingCashback] = useState(false);

  const maxWalletAmount = Math.min(wallet?.balance || 0, orderTotal);

  // Fetch cashback preview
  useEffect(() => {
    const fetchCashback = async () => {
      if (orderTotal > 0) {
        try {
          setLoadingCashback(true);
          const preview = await walletApi.calculateCashback(orderTotal, walletAmount);
          setCashbackPreview(preview.cashbackAmount);
        } catch (error) {
          console.error("Failed to calculate cashback:", error);
        } finally {
          setLoadingCashback(false);
        }
      }
    };

    fetchCashback();
  }, [orderTotal, walletAmount]);

  const handleCheckboxChange = (checked: boolean) => {
    setShouldUseWallet(checked);
    if (checked) {
      const defaultAmount = maxWalletAmount;
      setWalletAmount(defaultAmount);
      onWalletAmountChange(defaultAmount);
    } else {
      setWalletAmount(0);
      onWalletAmountChange(0);
    }
  };

  const handleAmountChange = (value: number | null) => {
    const amount = Math.min(value || 0, maxWalletAmount);
    setWalletAmount(amount);
    onWalletAmountChange(amount);
  };

  if (walletLoading) {
    return (
      <Card className="mb-4">
        <div className="flex justify-center py-4">
          <Spin />
        </div>
      </Card>
    );
  }

  if (!wallet || wallet.balance === 0) {
    return (
      <Card className="mb-4 bg-gray-50">
        <div className="flex items-center gap-3">
          <WalletOutlined className="text-gray-400 text-xl" />
          <div>
            <p className="text-sm text-gray-600">No wallet balance available</p>
            <p className="text-xs text-gray-500">Earn 5% cashback on this order!</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="mb-4"
      style={{
        borderColor: shouldUseWallet ? "#10b981" : undefined,
        backgroundColor: shouldUseWallet ? "#f0fdf4" : undefined,
      }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <WalletOutlined className="text-green-600 text-xl" />
            <div>
              <p className="font-semibold">Wallet Balance</p>
              <p className="text-sm text-green-600">₹{wallet.balance.toFixed(2)} available</p>
            </div>
          </div>
          <Checkbox
            checked={shouldUseWallet}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
          >
            Use Wallet
          </Checkbox>
        </div>

        {/* Amount Selection */}
        {shouldUseWallet && (
          <div className="space-y-3 pt-2 border-t">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">
                Amount to use (Max: ₹{maxWalletAmount.toFixed(2)})
              </label>
              <Slider
                min={0}
                max={maxWalletAmount}
                step={10}
                value={walletAmount}
                onChange={handleAmountChange}
                tooltip={{
                  formatter: (value) => `₹${value}`,
                }}
              />
            </div>

            <InputNumber
              prefix="₹"
              value={walletAmount}
              onChange={handleAmountChange}
              min={0}
              max={maxWalletAmount}
              precision={2}
              className="w-full"
              size="large"
            />

            {/* Summary */}
            <div className="bg-white rounded p-3 space-y-1 border">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Original Total:</span>
                <span>₹{orderTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-green-600">
                <span>Wallet Deduction:</span>
                <span>-₹{walletAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Amount to Pay:</span>
                <span className="text-lg">₹{(orderTotal - walletAmount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Cashback Preview */}
        {cashbackPreview > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-3 border border-amber-200">
            <div className="flex items-center gap-2">
              <GiftOutlined className="text-amber-600" />
              <div>
                <p className="text-sm font-semibold text-amber-900">
                  You&apos;ll earn ₹{cashbackPreview.toFixed(2)} cashback!
                </p>
                <p className="text-xs text-amber-700">Added to wallet after successful payment</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
