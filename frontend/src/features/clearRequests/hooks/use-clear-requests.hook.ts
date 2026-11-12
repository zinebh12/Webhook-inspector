"use client";

import { useMutation } from "@tanstack/react-query";
import { clearHooks } from "@/services/requests.api";

export const useClearHooks = () => {
  return useMutation({
    mutationFn: (id: string) => clearHooks(`/${id}/requests`),
  });
};
