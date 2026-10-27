"use client";

import { useEndpoints } from "../hooks/use-endpoints.hook";
import type { Endpoint } from "@/types/endpoints.types";

const EndpointsList = () => {
  const { data: endpoints } = useEndpoints();

  return (
    <div className="mx-1 space-y-2">
      {((endpoints ?? []) as Endpoint[]).map((endpoint: Endpoint) => (
        <div
          key={endpoint.id}
          className="border border-gray-700 rounded-xl p-2 bg-gray-900 text-xs capitalize space-y-1"
        >
          <h5>{endpoint.name}</h5>
          <span className="text-gray-500">{endpoint.slug}</span>
        </div>
      ))}
    </div>
  );
};

export default EndpointsList;
