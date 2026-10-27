'use client'

import { useQuery } from "@tanstack/react-query";
import { getEndpoints } from "@/services/endpoints.api";
import type { Endpoints } from "@/types/endpoints.types";

export const useEndpoints = () => {
  return useQuery({
    queryKey: ["endpoints"],
    queryFn: () => getEndpoints<Endpoints>("/"),
  });
};
