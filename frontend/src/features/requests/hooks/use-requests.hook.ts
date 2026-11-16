"use client";

import { useQuery } from "@tanstack/react-query";
import { getRequests } from "@/services/requests.api";
import type { WebhookRequests } from "@/types/requests.types";

export const useRequests = (id: string | null, search: string = "") => {
  const searchTerm = search.trim();

  return useQuery({
    queryKey: ["endpoints", id, "requests", searchTerm],
    queryFn: () => {
      const params = new URLSearchParams();

      if (searchTerm) {
        params.set("search", searchTerm);
      }

      const query = params.toString();

      return getRequests<WebhookRequests>(
        `/${id}/requests?${query ? query : ""}`,
      );
    },
    enabled: !!id,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
