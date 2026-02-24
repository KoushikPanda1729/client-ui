"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import { customerCallService, type IncomingCallData } from "@/services/callService";
import IncomingCallModal from "./IncomingCallModal";

export default function CallProvider({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const [incomingCall, setIncomingCall] = useState<IncomingCallData | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    customerCallService.connect(user.id, {
      onIncomingCall: (data) => {
        setIncomingCall(data);
      },
      onCallEnded: () => {
        setIncomingCall(null);
      },
      onRemoteStream: () => {
        // handled inside IncomingCallModal
      },
    });

    return () => {
      customerCallService.disconnect();
    };
  }, [isAuthenticated, user?.id]);

  return (
    <>
      {children}
      <IncomingCallModal callData={incomingCall} onClose={() => setIncomingCall(null)} />
    </>
  );
}
