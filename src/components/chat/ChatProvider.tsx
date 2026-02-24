"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { customerChatService } from "@/services/chatService";
import ChatDrawer from "./ChatDrawer";
import FloatingChatButton from "./FloatingChatButton";

export default function ChatProvider({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const [chatOpen, setChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    customerChatService.connect(user.id);

    // Track unread when chat is closed
    customerChatService.setUnreadHandler((increment) => {
      if (!chatOpen) {
        setUnreadCount((c) => c + increment);
      }
    });

    // Fetch initial unread count
    customerChatService
      .fetchUnreadCount(String(user.id))
      .then((count) => setUnreadCount(count))
      .catch(() => {});

    return () => {
      customerChatService.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user?.id]);

  // Reset unread when chat opens
  const handleOpenChat = () => {
    setUnreadCount(0);
    setChatOpen(true);
  };

  return (
    <>
      {children}

      {isAuthenticated && user && (
        <>
          <FloatingChatButton unreadCount={unreadCount} onClick={handleOpenChat} />

          <ChatDrawer
            open={chatOpen}
            onClose={() => setChatOpen(false)}
            roomId={String(user.id)}
            userId={String(user.id)}
            userName={`${user.firstName} ${user.lastName}`}
            onUnreadChange={setUnreadCount}
          />
        </>
      )}
    </>
  );
}
