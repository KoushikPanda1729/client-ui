"use client";

import { useRef, useState } from "react";
import { Modal, Button, Space, Typography, Avatar } from "antd";
import { PhoneOutlined, AudioOutlined, AudioMutedOutlined, UserOutlined } from "@ant-design/icons";
import { customerCallService, type IncomingCallData } from "@/services/callService";

const { Text, Title } = Typography;

type CallPhase = "incoming" | "connected" | "ended";

interface IncomingCallModalProps {
  callData: IncomingCallData | null;
  onClose: () => void;
}

export default function IncomingCallModal({ callData, onClose }: IncomingCallModalProps) {
  const [phase, setPhase] = useState<CallPhase>("incoming");
  const [muted, setMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleAccept = async () => {
    if (!callData) return;
    try {
      await customerCallService.acceptCall(callData.offer, (stream) => {
        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = stream;
          remoteAudioRef.current.play().catch(console.error);
        }
        setPhase("connected");
        timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
      });
    } catch (err) {
      console.error("[IncomingCallModal] Failed to accept call:", err);
      onClose();
    }
  };

  const handleReject = () => {
    customerCallService.rejectCall();
    clearInterval(timerRef.current!);
    onClose();
  };

  const handleEndCall = () => {
    customerCallService.endCall();
    clearInterval(timerRef.current!);
    setPhase("ended");
    setTimeout(onClose, 1200);
  };

  const toggleMute = () => {
    customerCallService["localStream"]?.getAudioTracks().forEach((t) => {
      t.enabled = muted;
    });
    setMuted((prev) => !prev);
  };

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Modal
      open={!!callData}
      footer={null}
      centered
      width={320}
      closable={false}
      maskClosable={false}
    >
      <audio ref={remoteAudioRef} autoPlay playsInline style={{ display: "none" }} />

      <div style={{ textAlign: "center", padding: "24px 0" }}>
        <Avatar
          size={80}
          icon={<UserOutlined />}
          style={{ backgroundColor: "#FF6B35", marginBottom: 16 }}
        />

        <Title level={4} style={{ margin: 0 }}>
          {callData?.callerName ?? "Admin"}
        </Title>

        <Text
          type={phase === "connected" ? "success" : "secondary"}
          style={{ display: "block", marginTop: 8, fontSize: 16 }}
        >
          {phase === "incoming" && "Incoming call..."}
          {phase === "connected" && formatDuration(duration)}
          {phase === "ended" && "Call ended"}
        </Text>

        {phase === "incoming" && (
          <Space style={{ marginTop: 32 }} size={24}>
            {/* Reject */}
            <Button
              shape="circle"
              size="large"
              danger
              icon={<PhoneOutlined rotate={135} />}
              onClick={handleReject}
              style={{ width: 56, height: 56, fontSize: 22 }}
            />
            {/* Accept */}
            <Button
              shape="circle"
              size="large"
              icon={<PhoneOutlined />}
              onClick={handleAccept}
              style={{
                backgroundColor: "#52c41a",
                color: "#fff",
                border: "none",
                width: 56,
                height: 56,
                fontSize: 22,
              }}
            />
          </Space>
        )}

        {phase === "connected" && (
          <Space style={{ marginTop: 32 }} size={24}>
            <Button
              shape="circle"
              size="large"
              icon={muted ? <AudioMutedOutlined /> : <AudioOutlined />}
              onClick={toggleMute}
              style={{
                backgroundColor: muted ? "#ff4d4f" : "#f0f0f0",
                color: muted ? "#fff" : "#666",
                border: "none",
                width: 56,
                height: 56,
              }}
            />
            <Button
              shape="circle"
              size="large"
              danger
              icon={<PhoneOutlined rotate={135} />}
              onClick={handleEndCall}
              style={{ width: 56, height: 56, fontSize: 22 }}
            />
          </Space>
        )}
      </div>
    </Modal>
  );
}
