"use client";

import { useMutation } from "@tanstack/react-query";
import { postEndpoint } from "@/services/endpoints.api";
import type { newEndpoint } from "@/types/endpoints.types";

type EndpointResponse = newEndpoint & {
  fullUrl: string;
};

export const usePostEndpoint = () => {
  return useMutation({
    mutationFn: (data: newEndpoint) =>
      postEndpoint<EndpointResponse>("/", data),
  });
};
