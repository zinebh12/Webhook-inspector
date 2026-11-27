"use client";

import { useQuery } from "@tanstack/react-query";
import { getRequests } from "@/services/requests.api";
import type { WebhookRequests } from "@/types/requests.types";

export const useRequests = (
  id: string | null,
  search: string = "",
  currentPage: number,
) => {
  const searchTerm = search.trim();

  return useQuery({
    queryKey: ["endpoints", id, "requests", searchTerm, currentPage],
    queryFn: () => {
      const params = new URLSearchParams();

      if (searchTerm) {
        params.set("search", searchTerm);
      }

      params.set("page", String(currentPage));
      params.set("limit", "10");

      return getRequests<WebhookRequests>(
        `/${id}/requests?${params.toString()}`,
      );
    },
    enabled: !!id,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
