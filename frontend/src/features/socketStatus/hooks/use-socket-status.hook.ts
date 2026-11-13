"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

export const useSocketStatus = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
      setConnectionError(null);
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    const onConnectError = (error: Error) => {
      setIsConnected(false);
      setConnectionError(error.message);
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
    };
  }, []);

  return { isConnected, connectionError };
};
