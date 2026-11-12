"use client";

import { useQuery } from "@tanstack/react-query";
import { getRequests } from "@/services/requests.api";
import type { WebhookRequests } from "@/types/requests.types";

export const useRequests = (id: string | null) => {
  return useQuery({
    queryKey: ["endpoints", id, "requests"],
    queryFn: () => getRequests<WebhookRequests>(`/${id}/requests`),
    enabled: !!id,
  });
};
