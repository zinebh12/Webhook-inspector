"use client";

import { useQuery } from "@tanstack/react-query";
import { getSingleEndpoint } from "@/services/endpoints.api";
import type { Endpoint } from "@/types/endpoints.types";

export const useEndpoint = (id: string | null) => {
  return useQuery({
    queryKey: ["endpoint", id],
    queryFn: () => getSingleEndpoint<Endpoint>(`/${id}`),
    enabled: !!id,
  });
};
