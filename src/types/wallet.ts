export interface Wallet {
  balance: number;
  currency: string;
}

export type TransactionType = "cashback" | "redemption" | "refund";
export type TransactionStatus = "pending" | "completed" | "failed" | "rolled_back";

export interface WalletTransaction {
  _id: string;
  walletId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  orderId: string;
  balanceBefore: number;
  balanceAfter: number;
  status: TransactionStatus;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransactionsResponse {
  transactions: WalletTransaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CashbackPreview {
  orderAmount: number;
  walletAmountUsed: number;
  cashbackAmount: number;
}
