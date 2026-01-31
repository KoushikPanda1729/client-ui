"use client";

import { useEffect, useState } from "react";
import { walletApi } from "@/lib/api/wallet";
import type { Wallet } from "@/types/wallet";

export function useWallet() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await walletApi.getBalance();
      setWallet(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch wallet balance");
      console.error("Error fetching wallet:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  return {
    wallet,
    loading,
    error,
    refresh: fetchBalance,
  };
}
