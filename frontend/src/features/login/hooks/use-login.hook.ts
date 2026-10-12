"use client";

import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth.api";
import type { LoginData } from "@/types/auth.types";

type AuthResponse = {
  id: string;
  email: string;
};

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginData) => login<AuthResponse>("/login", data),
  });
};
