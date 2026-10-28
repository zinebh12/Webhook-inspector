"use client";

import EndpointData from "@/components/layout/EndpointData";
import SideBar from "@/components/layout/SideBar";

import { useSearchParams } from "next/navigation";

const DashboardContent = () => {
  const searchParams = useSearchParams();
  const endpointId = searchParams.get("endpoint");

  return (
    <div className="flex items-start justify-start w-full h-full">
      <SideBar />
      <EndpointData endpointId={endpointId} />
    </div>
  );
};

export default DashboardContent;
