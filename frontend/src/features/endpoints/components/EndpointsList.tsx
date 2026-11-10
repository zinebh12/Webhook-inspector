"use client";

import { useEndpoints } from "../hooks/use-endpoints.hook";
import type { Endpoint } from "@/types/endpoints.types";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import DeleteBtn from "@/features/deleteEndpoint/components/DeleteBtn";

const EndpointsList = () => {
  const { data: endpoints } = useEndpoints();

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelectedEndpoint = (endpointId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("endpoint", endpointId);

    router.replace(`/dashboard?${params.toString()}`, {
      scroll: false,
    });
  };
 
  useEffect(() => {
    const endpointList = (endpoints ?? []) as Endpoint[];
    if (!endpointList.length || searchParams.get("endpoint")) return;

    handleSelectedEndpoint(endpointList[0].id);
  }, [endpoints]);

  return (
    <div className="mx-1 space-y-2">
      {((endpoints ?? []) as Endpoint[]).map((endpoint: Endpoint) => (
        <div
          onClick={() => handleSelectedEndpoint(endpoint.id)}
          key={endpoint.id}
          className="cursor-pointer border border-gray-700 rounded-xl p-2 bg-gray-900 text-xs capitalize space-y-1"
        >
          <div className="flex items-center justify-between">
            <h5>{endpoint.name}</h5>
            <DeleteBtn
              id={endpoint.id}
              firstEndpoint={
                ((endpoints ?? []) as Endpoint[]).filter(
                  (e) => e.id !== endpoint.id,
                )[0]
              }
            />
          </div>
          <span className="text-gray-500">{endpoint.slug}</span>
        </div>
      ))}
    </div>
  );
};

export default EndpointsList;
