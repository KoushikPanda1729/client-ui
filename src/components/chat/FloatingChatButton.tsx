"use client";

import { Badge } from "antd";
import { MessageOutlined } from "@ant-design/icons";

interface FloatingChatButtonProps {
  unreadCount: number;
  onClick: () => void;
}

export default function FloatingChatButton({ unreadCount, onClick }: FloatingChatButtonProps) {
  return (
    <div className="fixed bottom-24 right-6 z-40 md:bottom-6">
      <Badge count={unreadCount} color="#FF6B35">
        <button
          onClick={onClick}
          className="w-14 h-14 bg-[#FF6B35] rounded-full shadow-lg flex items-center justify-center hover:bg-[#e55a2b] transition-colors"
          aria-label="Open chat"
        >
          <MessageOutlined className="text-2xl text-white" />
        </button>
      </Badge>
    </div>
  );
}
