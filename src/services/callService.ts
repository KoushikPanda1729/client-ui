import { io, Socket } from "socket.io-client";
import { CALLING_SERVICE_URL } from "@/config/apiConfig";

const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
  { urls: "stun:stun1.l.google.com:19302" },
];

export interface IncomingCallData {
  from: string;
  callerName: string;
  offer: RTCSessionDescriptionInit;
}

export interface CustomerCallCallbacks {
  onIncomingCall: (data: IncomingCallData) => void;
  onCallEnded: () => void;
  onRemoteStream: (stream: MediaStream) => void;
}

class CustomerCallService {
  private socket: Socket | null = null;
  private pc: RTCPeerConnection | null = null;
  private localStream: MediaStream | null = null;
  private currentCallFrom: string | null = null;
  private registeredUserId: string | null = null;

  connect(userId: string | number, callbacks: CustomerCallCallbacks) {
    if (this.socket?.connected && this.registeredUserId === String(userId)) return;

    this.registeredUserId = String(userId);

    this.socket = io(CALLING_SERVICE_URL, {
      transports: ["websocket"],
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      console.log("[CustomerCallService] Connected:", this.socket?.id);
      this.socket!.emit("register", String(userId));
    });

    this.socket.on("disconnect", () => {
      console.log("[CustomerCallService] Disconnected");
    });

    // Listen for incoming calls from admin
    this.socket.on("call:incoming", (data: IncomingCallData) => {
      this.currentCallFrom = String(data.from);
      callbacks.onIncomingCall(data);
    });

    // Listen for call end from admin
    this.socket.on("call:ended", () => {
      this._cleanup();
      callbacks.onCallEnded();
    });
  }

  async acceptCall(
    offer: RTCSessionDescriptionInit,
    onRemoteStream: (stream: MediaStream) => void
  ) {
    if (!this.socket?.connected || !this.currentCallFrom) return;

    // Get microphone
    this.localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    this.pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });

    this.localStream.getTracks().forEach((track) => {
      this.pc!.addTrack(track, this.localStream!);
    });

    this.pc.ontrack = (e) => {
      onRemoteStream(e.streams[0]);
    };

    this.pc.onicecandidate = (e) => {
      if (e.candidate) {
        this.socket!.emit("call:ice-candidate", {
          to: this.currentCallFrom,
          candidate: e.candidate.toJSON(),
        });
      }
    };

    // Set the admin's offer as remote description
    await this.pc.setRemoteDescription(new RTCSessionDescription(offer));

    // Create and send answer
    const answer = await this.pc.createAnswer();
    await this.pc.setLocalDescription(answer);

    this.socket.emit("call:answer", {
      to: this.currentCallFrom,
      answer: { type: answer.type, sdp: answer.sdp },
      from: this.registeredUserId,
    });

    // Handle incoming ICE candidates from admin
    this.socket.on("call:ice-candidate", async ({ candidate }) => {
      try {
        await this.pc?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("[CustomerCallService] Error adding ICE candidate:", e);
      }
    });
  }

  rejectCall() {
    if (this.currentCallFrom && this.socket?.connected) {
      this.socket.emit("call:reject", { to: this.currentCallFrom });
    }
    this._cleanup();
  }

  endCall() {
    if (this.currentCallFrom && this.socket?.connected) {
      this.socket.emit("call:end", { to: this.currentCallFrom });
    }
    this._cleanup();
  }

  private _cleanup() {
    this.localStream?.getTracks().forEach((t) => t.stop());
    this.pc?.close();
    this.pc = null;
    this.localStream = null;
    this.currentCallFrom = null;
    this.socket?.off("call:ice-candidate");
  }

  disconnect() {
    this._cleanup();
    this.socket?.off("call:incoming");
    this.socket?.off("call:ended");
    this.socket?.disconnect();
    this.socket = null;
    this.registeredUserId = null;
  }
}

export const customerCallService = new CustomerCallService();
