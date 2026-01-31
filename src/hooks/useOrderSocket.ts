"use client";

import { useEffect, useRef } from "react";
import { useAppSelector } from "@/store/hooks";
import { socketService } from "@/services/socket.service";
import type { Order } from "@/types/billing.types";

interface UseOrderSocketOptions {
  onOrderStatusUpdate?: (order: Order) => void;
}

export const useOrderSocket = (options?: UseOrderSocketOptions) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const connectedRef = useRef(false);
  const callbackRef = useRef(options?.onOrderStatusUpdate);

  useEffect(() => {
    callbackRef.current = options?.onOrderStatusUpdate;
  }, [options?.onOrderStatusUpdate]);

  useEffect(() => {
    if (!isAuthenticated || !user || connectedRef.current) return;

    const socket = socketService.connect();
    connectedRef.current = true;

    // Customer joins their personal room
    const customerRoom = `customer_${user.id}`;
    socket.on("connect", () => {
      socketService.joinRoom(customerRoom);
    });
    if (socket.connected) {
      socketService.joinRoom(customerRoom);
    }

    const handleStatusUpdate = (data: Order) => {
      callbackRef.current?.(data);
    };

    socketService.on("order-status-updated", handleStatusUpdate as (data: unknown) => void);
    socketService.on("order-payment-completed", handleStatusUpdate as (data: unknown) => void);
    socketService.on("order-payment-refunded", handleStatusUpdate as (data: unknown) => void);

    return () => {
      socketService.off("order-status-updated", handleStatusUpdate as (data: unknown) => void);
      socketService.off("order-payment-completed", handleStatusUpdate as (data: unknown) => void);
      socketService.off("order-payment-refunded", handleStatusUpdate as (data: unknown) => void);
      connectedRef.current = false;
    };
  }, [isAuthenticated, user]);
};
