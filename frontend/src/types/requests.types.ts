export interface WebhookRequest {
  body: WebhookRequestBody;
  endpointId: string;
  headers: WebhookRequestHeaders;
  id: string;
  ip: string;
  method: string;
  query: Record<string, string>;
  receivedAt: string;
  statusCode: number;
}

export interface WebhookRequestBody {
  message: string;
}

export interface WebhookRequestHeaders {
  "cache-control": string;
  "postman-token": string;
  "content-type": string;
  "content-length": string;
  host: string;
  "user-agent": string;
  accept: string;
  "accept-encoding": string;
  connection: string;
}

export interface WebhookRequests {
  data: WebhookRequest[];
}
