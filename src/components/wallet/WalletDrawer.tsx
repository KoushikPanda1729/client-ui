"use client";

import { useState, useEffect, useCallback } from "react";
import { Drawer, Button, Spin, Empty, Card, Tag } from "antd";
import {
  WalletOutlined,
  GiftOutlined,
  MinusCircleOutlined,
  UndoOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { walletApi } from "@/lib/api/wallet";
import type { WalletTransaction } from "@/types/wallet";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface WalletDrawerProps {
  open: boolean;
  onClose: () => void;
  balance: number;
  currency: string;
}

const PAGE_LIMIT = 10;

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "cashback":
      return <GiftOutlined className="text-green-500" />;
    case "redemption":
      return <MinusCircleOutlined className="text-orange-500" />;
    case "refund":
      return <UndoOutlined className="text-blue-500" />;
    default:
      return null;
  }
};

const getTransactionColor = (type: string) => {
  switch (type) {
    case "cashback":
      return "success";
    case "redemption":
      return "warning";
    case "refund":
      return "processing";
    default:
      return "default";
  }
};

export default function WalletDrawer({ open, onClose, balance, currency }: WalletDrawerProps) {
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchTransactions = useCallback(async (pageNum: number, append: boolean) => {
    const setLoadingState = append ? setLoadingMore : setLoading;
    try {
      setLoadingState(true);
      const data = await walletApi.getTransactions(pageNum, PAGE_LIMIT);
      setTransactions((prev) => (append ? [...prev, ...data.transactions] : data.transactions));
      setHasMore(data.pagination.page < data.pagination.pages);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoadingState(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setTransactions([]);
      setPage(1);
      setHasMore(false);
      fetchTransactions(1, false);
    }
  }, [open, fetchTransactions]);

  const handleLoadMore = () => {
    fetchTransactions(page + 1, true);
  };

  const currencySymbol = currency === "INR" ? "₹" : currency;

  return (
    <Drawer
      title={
        <div className="flex items-center gap-2">
          <WalletOutlined className="text-green-600" />
          <span>My Wallet</span>
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width={400}
      styles={{ body: { padding: "16px" } }}
    >
      {/* Balance Card */}
      <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <p className="text-sm text-gray-600 mb-1">Available Balance</p>
        <p className="text-2xl font-bold text-green-700">
          {currencySymbol}
          {balance.toFixed(2)}
        </p>
      </div>

      {/* Transactions */}
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Transaction History
      </h3>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spin indicator={<LoadingOutlined spin />} size="large" />
        </div>
      ) : transactions.length === 0 ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No transactions yet" />
      ) : (
        <div className="space-y-3">
          {transactions.map((tx) => (
            <Card key={tx._id} size="small" className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex gap-3 items-start flex-1">
                  <div className="mt-1">{getTransactionIcon(tx.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Tag color={getTransactionColor(tx.type)}>{tx.type.toUpperCase()}</Tag>
                      <Tag color={tx.status === "completed" ? "success" : "default"}>
                        {tx.status}
                      </Tag>
                    </div>
                    <p className="text-sm text-gray-600 mb-1 truncate">
                      Order:{" "}
                      <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded">
                        {tx.orderId}
                      </span>
                    </p>
                    <p className="text-xs text-gray-500">
                      {dayjs(tx.createdAt).format("MMM DD, YYYY • hh:mm A")}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p
                    className={`text-lg font-semibold ${
                      tx.type === "redemption" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {tx.type === "redemption" ? "-" : "+"}
                    {currencySymbol}
                    {Math.abs(tx.amount).toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>
          ))}

          {hasMore && (
            <div className="flex justify-center pt-2 pb-4">
              <Button onClick={handleLoadMore} loading={loadingMore}>
                Load More
              </Button>
            </div>
          )}
        </div>
      )}
    </Drawer>
  );
}
