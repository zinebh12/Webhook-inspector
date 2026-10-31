"use client";

import EndpointData from "@/components/layout/EndpointData";
import SideBar from "@/components/layout/SideBar";

import { useSearchParams } from "next/navigation";
import MobileNavigation from "./MobileNavigation";

import { useState } from "react";

type ActiveTab = "endpoints" | "requests";

const DashboardContent = () => {
  const searchParams = useSearchParams();
  const endpointId = searchParams.get("endpoint");

  const [activeTab, setActiveTab] = useState<ActiveTab>("endpoints");

  return (
    <>
      <div className="items-start justify-start w-full h-full hidden md:flex">
        <SideBar />
        <EndpointData endpointId={endpointId} />
      </div>

      <div className="md:hidden">
        <MobileNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex items-start justify-start w-full h-full">
          {activeTab === "endpoints" && <SideBar />}
          {activeTab === "requests" && <EndpointData endpointId={endpointId} />}
        </div>
      </div>
    </>
  );
};

export default DashboardContent;
