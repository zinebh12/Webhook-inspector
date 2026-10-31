export interface Endpoints {
  endpoints: Endpoint[];
}

export interface Endpoint {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  isActive: boolean;
  userId: number | undefined;
  requests: [];
}

export interface newEndpoint {
  name: string;
  userId: number | undefined;
}

export type EndpointResponse = {
  endpoint: Endpoint;
  fullUrl: string;
};
