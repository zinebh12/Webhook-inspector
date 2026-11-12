const API_BASE_URL = `http://localhost:3001/api/webhook/endpoints`;

export const getRequests = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch requests");
  }

  return data as T;
};
