export interface Endpoints {
  endpoints: Endpoint[];
}

export interface Endpoint {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  isActive: boolean;
  userId: string;
  requests: [];
}
