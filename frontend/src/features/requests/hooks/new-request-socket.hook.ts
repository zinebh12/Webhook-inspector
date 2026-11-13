"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socket } from "@/lib/socket";
import { WebhookRequest, WebhookRequests } from "@/types/requests.types";

export const useNewRequestSocket = (endpointId: string | null) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!endpointId) return;

    socket.connect();

    const handleConnect = () => {
      socket.emit("subscribe", endpointId);
    };

    const handleNewRequest = (request: WebhookRequest) => {
      if (request.endpointId !== endpointId) return;

      queryClient.setQueryData<WebhookRequests>(
        ["endpoints", endpointId, "requests"],
        (oldData) => {
          if (!oldData) return oldData;

          return { ...oldData, data: [request, ...oldData.data] };
        },
      );
    };

    socket.on("connect", handleConnect);
    socket.on("newRequest", handleNewRequest);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("newRequest", handleNewRequest);
      socket.disconnect();
    };
  }, [endpointId]);
};
