const API_BASE_URL = `http://localhost:3001/api/webhook/endpoints`;

export const getEndpoints = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}?${path}`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch endpoints");
  }

  return response.json() as T;
};
