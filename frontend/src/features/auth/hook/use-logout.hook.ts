"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "@/services/auth.api";

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => logout("/logout"),
    onSuccess: async () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      queryClient.removeQueries({ queryKey: ["endpoints"] });
    },
  });
};
