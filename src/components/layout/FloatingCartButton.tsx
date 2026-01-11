"use client";

import { ShoppingCartOutlined } from "@ant-design/icons";
import { Badge } from "antd";
import { useRouter } from "next/navigation";

interface FloatingCartButtonProps {
  cartCount: number;
}

export default function FloatingCartButton({ cartCount }: FloatingCartButtonProps) {
  const router = useRouter();

  if (cartCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 md:hidden z-40">
      <Badge count={cartCount} color="#FF6B35">
        <button
          onClick={() => router.push("/cart")}
          className="w-14 h-14 bg-[#FF6B35] rounded-full shadow-lg flex items-center justify-center"
        >
          <ShoppingCartOutlined className="text-2xl text-white" />
        </button>
      </Badge>
    </div>
  );
}
