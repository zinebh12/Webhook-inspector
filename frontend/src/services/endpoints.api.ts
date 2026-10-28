import type { newEndpoint } from "@/types/endpoints.types";

const API_BASE_URL = `http://localhost:3001/api/webhook/endpoints`;

export const getEndpoints = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}?${path}`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch endpoints");
  }

  return data as T;
};

export const getSingleEndpoint = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to get endpoint");
  }

  return data as T;
};

export const postEndpoint = async <T>(
  path: string,
  newEndpoint: newEndpoint,
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}?${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(newEndpoint),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to add endpoint");
  }

  return data as T;
};
