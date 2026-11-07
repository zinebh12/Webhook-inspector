"use client";

import { useMutation } from "@tanstack/react-query";
import { deleteEndpoint } from "@/services/endpoints.api";

export const useDeleteEndpoint = () => {
  return useMutation({
    mutationFn: (id: string) => deleteEndpoint(`/${id}`),
  });
};
