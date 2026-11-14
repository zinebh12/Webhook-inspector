"use client";

import { useQuery } from "@tanstack/react-query";

import { getRequests } from "@/services/requests.api";

import type { WebhookRequests } from "@/types/requests.types";

export const useSearch = (id: string | null, search: string) => {
  return useQuery({
    queryKey: ["endpoints", id, "requests", { search }],
    queryFn: () =>
      getRequests<WebhookRequests>(
        `/${id}/requests?search=${encodeURIComponent(search)}`,
      ),
    enabled: !!id && !!search,
  });
};
