import axiosInstance from "@/lib/axios";
import { BILLING_SERVICE } from "@/config/apiConfig";
import type { Wallet, WalletTransactionsResponse, CashbackPreview } from "@/types/wallet";

export const walletApi = {
  /**
   * Get user's wallet balance
   */
  getBalance: async (): Promise<Wallet> => {
    return axiosInstance.get(`${BILLING_SERVICE}/wallets/balance`);
  },

  /**
   * Get wallet transaction history with pagination
   */
  getTransactions: async (
    page: number = 1,
    limit: number = 20
  ): Promise<WalletTransactionsResponse> => {
    return axiosInstance.get(`${BILLING_SERVICE}/wallets/transactions`, {
      params: { page, limit },
    });
  },

  /**
   * Calculate potential cashback for an order
   */
  calculateCashback: async (
    orderAmount: number,
    walletAmountUsed: number = 0
  ): Promise<CashbackPreview> => {
    return axiosInstance.post(`${BILLING_SERVICE}/wallets/calculate-cashback`, {
      orderAmount,
      walletAmountUsed,
    });
  },
};
