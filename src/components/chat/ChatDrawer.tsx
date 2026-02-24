"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Drawer, Input, Button, Avatar, Typography, Space, Spin } from "antd";
import { SendOutlined, UserOutlined, CustomerServiceOutlined } from "@ant-design/icons";
import { customerChatService, ChatMessage } from "@/services/chatService";

const { Text } = Typography;

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
  roomId: string; // customerId (the current user's id)
  userId: string;
  userName: string;
  onUnreadChange?: (count: number) => void;
}

export default function ChatDrawer({
  open,
  onClose,
  roomId,
  userId,
  userName,
  onUnreadChange,
}: ChatDrawerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [typingText, setTypingText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleMessage = useCallback(
    (msg: ChatMessage) => {
      if (msg.roomId !== roomId) return;
      setMessages((prev) => {
        if (prev.some((m) => m._id === msg._id)) return prev;
        return [...prev, msg];
      });
      if (msg.senderRole === "admin") {
        customerChatService.markRead(roomId);
        onUnreadChange?.(0);
      }
    },
    [roomId, onUnreadChange]
  );

  const handleTyping = useCallback((data: { senderName: string; isTyping: boolean }) => {
    setTypingText(data.isTyping ? `${data.senderName} is typing...` : "");
  }, []);

  useEffect(() => {
    if (!open) return;

    customerChatService.joinRoom(roomId);

    customerChatService
      .fetchHistory(roomId)
      .then((msgs) => setMessages(msgs))
      .catch(console.error)
      .finally(() => setLoading(false));

    customerChatService.markRead(roomId);
    onUnreadChange?.(0);

    customerChatService.onMessage(handleMessage);
    customerChatService.onTyping(handleTyping);

    return () => {
      customerChatService.offMessage(handleMessage);
      customerChatService.offTyping(handleTyping);
      customerChatService.leaveRoom(roomId);
    };
  }, [open, roomId, handleMessage, handleTyping, onUnreadChange]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText]);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;
    customerChatService.sendMessage({ roomId, senderId: userId, senderName: userName, text });
    setInputText("");
    customerChatService.sendTyping(roomId, userName, false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    customerChatService.sendTyping(roomId, userName, true);
    clearTimeout(typingTimerRef.current!);
    typingTimerRef.current = setTimeout(() => {
      customerChatService.sendTyping(roomId, userName, false);
    }, 1500);
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <Drawer
      title={
        <Space>
          <CustomerServiceOutlined style={{ color: "#FF6B35" }} />
          <span>Chat with Support</span>
        </Space>
      }
      placement="right"
      width={360}
      open={open}
      onClose={onClose}
      styles={{ body: { display: "flex", flexDirection: "column", padding: 0 } }}
    >
      {/* Messages area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          maxHeight: "calc(100vh - 180px)",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", paddingTop: 40 }}>
            <Spin />
          </div>
        ) : messages.length === 0 ? (
          <Text type="secondary" style={{ textAlign: "center", marginTop: 40, display: "block" }}>
            Hi! How can we help you today?
          </Text>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderRole === "customer";
            return (
              <div
                key={msg._id}
                style={{
                  display: "flex",
                  flexDirection: isMe ? "row-reverse" : "row",
                  alignItems: "flex-end",
                  gap: 8,
                }}
              >
                <Avatar
                  size="small"
                  icon={<UserOutlined />}
                  style={{ backgroundColor: isMe ? "#FF6B35" : "#1677ff", flexShrink: 0 }}
                />
                <div style={{ maxWidth: "72%" }}>
                  <div
                    style={{
                      backgroundColor: isMe ? "#FF6B35" : "#f0f0f0",
                      color: isMe ? "#fff" : "#000",
                      padding: "8px 12px",
                      borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.text}
                  </div>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: 11,
                      display: "block",
                      textAlign: isMe ? "right" : "left",
                      marginTop: 2,
                    }}
                  >
                    {formatTime(msg.createdAt)}
                  </Text>
                </div>
              </div>
            );
          })
        )}

        {typingText && (
          <Text type="secondary" style={{ fontSize: 12, fontStyle: "italic" }}>
            {typingText}
          </Text>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #f0f0f0",
          display: "flex",
          gap: 8,
          backgroundColor: "#fff",
        }}
      >
        <Input
          value={inputText}
          onChange={handleInputChange}
          onPressEnter={handleSend}
          placeholder="Type a message..."
          style={{ borderRadius: 20 }}
        />
        <Button
          type="primary"
          shape="circle"
          icon={<SendOutlined />}
          onClick={handleSend}
          disabled={!inputText.trim()}
          style={{ backgroundColor: "#FF6B35", border: "none" }}
        />
      </div>
    </Drawer>
  );
}
