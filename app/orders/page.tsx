"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Table, Tag, Dropdown, Modal, Badge, Avatar, Select } from "antd";
import type { MenuProps } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  MoreOutlined,
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  ShoppingCartOutlined,
  PhoneOutlined,
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  CloseOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import Link from "next/link";

const { Option } = Select;

interface OrderData {
  key: string;
  orderId: string;
  orderAmount: number;
  orderDate: string;
  paymentType: string;
  orderStatus: "Preparing" | "Delivered" | "Cancelled" | "Out for delivery";
}

const initialData: OrderData[] = [
  {
    key: "1",
    orderId: "4dfdl53234545",
    orderAmount: 4000,
    orderDate: "23.11.2022",
    paymentType: "COD",
    orderStatus: "Preparing",
  },
  {
    key: "2",
    orderId: "4dfdl53234546",
    orderAmount: 4000,
    orderDate: "23.11.2022",
    paymentType: "COD",
    orderStatus: "Delivered",
  },
  {
    key: "3",
    orderId: "4dfdl53234547",
    orderAmount: 4000,
    orderDate: "23.11.2022",
    paymentType: "COD",
    orderStatus: "Delivered",
  },
  {
    key: "4",
    orderId: "4dfdl53234548",
    orderAmount: 4000,
    orderDate: "23.11.2022",
    paymentType: "COD",
    orderStatus: "Delivered",
  },
  {
    key: "5",
    orderId: "4dfdl53234549",
    orderAmount: 4000,
    orderDate: "23.11.2022",
    paymentType: "COD",
    orderStatus: "Delivered",
  },
  {
    key: "6",
    orderId: "4dfdl53234550",
    orderAmount: 4000,
    orderDate: "23.11.2022",
    paymentType: "COD",
    orderStatus: "Delivered",
  },
  {
    key: "7",
    orderId: "4dfdl53234551",
    orderAmount: 4000,
    orderDate: "23.11.2022",
    paymentType: "COD",
    orderStatus: "Delivered",
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, loading, user } = useAuth();
  const dispatch = useAppDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [data, setData] = useState<OrderData[]>(initialData);

  const handleLogout = async () => {
    await dispatch(logout());
    router.push("/");
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      label: (
        <div className="px-2 py-1">
          <p className="font-semibold text-gray-900">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-sm text-gray-600">{user?.email}</p>
          <p className="text-xs text-gray-500 mt-1">Role: {user?.role}</p>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, loading, router]);

  const showDeleteConfirm = (orderId: string) => {
    Modal.confirm({
      title: "Are you sure?",
      icon: <ExclamationCircleOutlined />,
      content: "Do you want to delete this order? This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        setData((prevData) => prevData.filter((order) => order.orderId !== orderId));
      },
      onCancel() {
        // Do nothing
      },
    });
  };

  const handleView = (orderId: string) => {
    router.push(`/orders/${orderId}`);
  };

  const getMenuItems = (orderId: string): MenuProps["items"] => [
    {
      key: "view",
      label: "View",
      icon: <EyeOutlined />,
      onClick: () => handleView(orderId),
    },
    {
      key: "delete",
      label: "Delete",
      icon: <DeleteOutlined />,
      onClick: () => showDeleteConfirm(orderId),
      danger: true,
    },
  ];

  const columns: ColumnsType<OrderData> = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (orderId: string) => (
        <Link href={`/orders/${orderId}`} className="text-blue-600 hover:text-blue-800 font-medium">
          {orderId}
        </Link>
      ),
    },
    {
      title: "Order amount",
      dataIndex: "orderAmount",
      key: "orderAmount",
      render: (amount: number) => `₹${amount}`,
    },
    {
      title: "Order date",
      dataIndex: "orderDate",
      key: "orderDate",
    },
    {
      title: "Payment type",
      dataIndex: "paymentType",
      key: "paymentType",
    },
    {
      title: "Order status",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status: OrderData["orderStatus"]) => {
        let color = "default";
        if (status === "Preparing") color = "orange";
        if (status === "Delivered") color = "green";
        if (status === "Cancelled") color = "red";
        if (status === "Out for delivery") color = "blue";

        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_: unknown, record: OrderData) => (
        <Dropdown
          menu={{ items: getMenuItems(record.orderId) }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <MoreOutlined className="text-xl text-gray-600" />
          </button>
        </Dropdown>
      ),
    },
  ];

  // Show loading or nothing while checking authentication
  if (loading || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F5F1ED]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#FF6B35] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
                <span className="text-xl sm:text-2xl font-bold text-gray-900">pizza</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg hover:border-[#FF6B35] transition-colors">
                <EnvironmentOutlined className="text-[#FF6B35]" />
                <Select
                  defaultValue="mumbai"
                  variant="borderless"
                  style={{ width: 100 }}
                  suffixIcon={null}
                >
                  <Option value="mumbai">Mumbai</Option>
                  <Option value="delhi">Delhi</Option>
                  <Option value="bangalore">Bangalore</Option>
                </Select>
              </div>
              <Link href="/#menu" className="text-gray-700 hover:text-[#FF6B35] font-medium">
                Menu
              </Link>
              <button
                onClick={() => router.push("/orders")}
                className="text-gray-700 hover:text-[#FF6B35] font-medium"
              >
                Orders
              </button>
            </nav>

            {/* Cart, Phone, User Avatar and Mobile Menu */}
            <div className="flex items-center gap-3 sm:gap-4">
              <Badge count={0} showZero={false} color="#FF6B35">
                <ShoppingCartOutlined
                  onClick={() => router.push("/cart")}
                  className="text-xl sm:text-2xl text-gray-700 cursor-pointer"
                />
              </Badge>
              <a
                href="tel:+919800098998"
                className="hidden sm:flex items-center gap-2 text-gray-700 hover:text-[#FF6B35] transition-colors"
              >
                <PhoneOutlined />
                <span className="hidden md:inline text-sm lg:text-base">+91 9800 098 998</span>
              </a>
              {isAuthenticated ? (
                <Dropdown
                  menu={{ items: userMenuItems }}
                  placement="bottomRight"
                  trigger={["click"]}
                >
                  <div className="hidden lg:flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
                    <Avatar
                      style={{ backgroundColor: "#FF6B35" }}
                      icon={<UserOutlined />}
                      size="default"
                    />
                    <div className="hidden xl:block text-left">
                      <p className="text-sm font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-600">{user?.role}</p>
                    </div>
                  </div>
                </Dropdown>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="hidden lg:block text-gray-700 hover:text-gray-900 font-medium"
                >
                  Login
                </button>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden text-gray-700 p-2"
              >
                {mobileMenuOpen ? (
                  <CloseOutlined className="text-xl" />
                ) : (
                  <MenuOutlined className="text-xl" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4 space-y-3">
              <div className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg w-fit">
                <EnvironmentOutlined className="text-[#FF6B35]" />
                <Select
                  defaultValue="mumbai"
                  variant="borderless"
                  style={{ width: 100 }}
                  suffixIcon={null}
                >
                  <Option value="mumbai">Mumbai</Option>
                  <Option value="delhi">Delhi</Option>
                  <Option value="bangalore">Bangalore</Option>
                </Select>
              </div>
              <Link
                href="/#menu"
                className="block py-2 text-gray-700 hover:text-[#FF6B35] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                Menu
              </Link>
              <button
                onClick={() => {
                  router.push("/orders");
                  setMobileMenuOpen(false);
                }}
                className="block py-2 text-gray-700 hover:text-[#FF6B35] font-medium w-full text-left"
              >
                Orders
              </button>
              {isAuthenticated ? (
                <>
                  <div className="py-2 px-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar
                        style={{ backgroundColor: "#FF6B35" }}
                        icon={<UserOutlined />}
                        size="large"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{user?.email}</p>
                        <p className="text-xs text-gray-500">Role: {user?.role}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 py-2 text-red-600 hover:text-red-700 font-medium w-full text-left"
                  >
                    <LogoutOutlined />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    router.push("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="block py-2 text-gray-700 hover:text-[#FF6B35] font-medium w-full text-left"
                >
                  Login
                </button>
              )}
              <a
                href="tel:+919800098998"
                className="flex items-center gap-2 py-2 text-gray-700 hover:text-[#FF6B35] font-medium sm:hidden"
              >
                <PhoneOutlined />
                <span>+91 9800 098 998</span>
              </a>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My orders</h1>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
            }}
            className="orders-table"
          />
        </div>
      </div>
    </div>
  );
}
