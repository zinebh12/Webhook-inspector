"use client";

import { useMutation } from "@tanstack/react-query";
import { patchActiveEndpoint } from "@/services/endpoints.api";

type toggleIsActive = {
  id: string;
  isActive: boolean;
};


export const usePatchEndpoint = () => {
  return useMutation({
    mutationFn: ({ id, isActive }: toggleIsActive) =>
      patchActiveEndpoint(`/${id}`, { isActive }),
  });
};
