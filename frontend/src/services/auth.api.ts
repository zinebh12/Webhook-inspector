import type { RegisterData, LoginData } from "@/types/auth.types";
const API_BASE_URL = `http://localhost:3001/api/auth`;

export const register = async <T>(
  path: string,
  user: RegisterData,
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(user),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Failed to register user");
  }
  return data as T;
};

export const login = async <T>(path: string, user: LoginData): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(user),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Invalid email or password");
  }

  return data as T;
};

export const user = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "User not found");
  }

  return data as T;
};

export const logout = async (path: string) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to logout");
  }

  return data;
};
