"use client";

import { useQuery } from "@tanstack/react-query";
import { getSingleEndpoint } from "@/services/endpoints.api";
import type { EndpointResponse } from "@/types/endpoints.types";

export const useEndpoint = (id: string | null) => {
  return useQuery({
    queryKey: ["endpoint", id],
    queryFn: () => getSingleEndpoint<EndpointResponse>(`/${id}`),
    enabled: !!id,
  });
};
