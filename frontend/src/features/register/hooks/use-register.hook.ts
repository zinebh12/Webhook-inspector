"use client";

import { useMutation } from "@tanstack/react-query";
import { register } from "@/services/auth.api";
import type { RegisterData } from "@/types/auth.types";

type AuthResponse = {
  id: string;
  email: string;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) =>
      register<AuthResponse>("/register", data),
  });
};
