"use client";

import { useState, useEffect } from "react";
import { Card, Statistic, Tabs, message } from "antd";
import { WalletOutlined, HistoryOutlined } from "@ant-design/icons";
import { useWallet } from "@/hooks/useWallet";
import { TransactionList } from "@/components/wallet/TransactionList";
import { walletApi } from "@/lib/api/wallet";
import type { WalletTransaction } from "@/types/wallet";

const { TabPane } = Tabs;

export default function WalletPage() {
  const { wallet, loading: walletLoading } = useWallet();
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const fetchTransactions = async (page: number = 1) => {
    try {
      setLoading(true);
      const data = await walletApi.getTransactions(page, 20);
      setTransactions(data.transactions);
      setPagination(data.pagination);
    } catch (error) {
      message.error("Failed to load transactions");
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handlePageChange = (page: number) => {
    fetchTransactions(page);
  };

  const filteredTransactions =
    activeFilter === "all" ? transactions : transactions.filter((t) => t.type === activeFilter);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">My Wallet</h1>

      {/* Wallet Balance Card */}
      <Card className="mb-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <Statistic
          title={
            <span className="text-gray-600 flex items-center gap-2">
              <WalletOutlined /> Current Balance
            </span>
          }
          value={wallet?.balance || 0}
          precision={2}
          prefix="₹"
          loading={walletLoading}
          valueStyle={{ color: "#059669", fontSize: "2.5rem" }}
          className="text-center"
        />
        <p className="text-center text-sm text-gray-600 mt-2">
          Earn 5% cashback on every order! 🎁
        </p>
      </Card>

      {/* Transactions Section */}
      <Card
        title={
          <span className="flex items-center gap-2">
            <HistoryOutlined /> Transaction History
          </span>
        }
      >
        <Tabs activeKey={activeFilter} onChange={setActiveFilter} className="mb-4">
          <TabPane tab="All" key="all" />
          <TabPane tab="Cashback" key="cashback" />
          <TabPane tab="Redeemed" key="redemption" />
          <TabPane tab="Refunds" key="refund" />
        </Tabs>

        <TransactionList
          transactions={filteredTransactions}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </Card>
    </div>
  );
}
