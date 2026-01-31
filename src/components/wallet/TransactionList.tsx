"use client";

import { useState } from "react";
import { Card, Tag, Pagination, Empty, Spin } from "antd";
import {
  GiftOutlined,
  MinusCircleOutlined,
  UndoOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import type { WalletTransaction } from "@/types/wallet";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface TransactionListProps {
  transactions: WalletTransaction[];
  loading?: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  onPageChange: (page: number) => void;
}

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

export function TransactionList({
  transactions,
  loading,
  pagination,
  onPageChange,
}: TransactionListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin indicator={<LoadingOutlined spin />} size="large" />
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="No transactions yet"
        className="py-20"
      />
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction) => (
        <Card key={transaction._id} className="hover:shadow-md transition-shadow" size="small">
          <div className="flex items-start justify-between">
            <div className="flex gap-3 items-start flex-1">
              <div className="mt-1">{getTransactionIcon(transaction.type)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Tag color={getTransactionColor(transaction.type)}>
                    {transaction.type.toUpperCase()}
                  </Tag>
                  <Tag color={transaction.status === "completed" ? "success" : "default"}>
                    {transaction.status}
                  </Tag>
                </div>
                <p className="text-sm text-gray-600 mb-1">
                  Order ID:{" "}
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {transaction.orderId}
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  {dayjs(transaction.createdAt).format("MMM DD, YYYY • hh:mm A")} (
                  {dayjs(transaction.createdAt).fromNow()})
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`text-lg font-semibold ${
                  transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {transaction.amount >= 0 ? "+" : ""}₹{Math.abs(transaction.amount).toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">
                Balance: ₹{transaction.balanceAfter.toFixed(2)}
              </p>
            </div>
          </div>
        </Card>
      ))}

      {pagination.pages > 1 && (
        <div className="flex justify-center pt-4">
          <Pagination
            current={pagination.page}
            total={pagination.total}
            pageSize={pagination.limit}
            onChange={onPageChange}
            showSizeChanger={false}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} transactions`}
          />
        </div>
      )}
    </div>
  );
}
