import { MobileNavigationProps } from "@/types/nav.types";

const MobileNavigation = ({
  activeTab,
  onTabChange,
}: MobileNavigationProps) => {
  return (
    <div className="flex items-center justify-between w-full ">
      <button
        type="button"
        onClick={() => onTabChange("endpoints")}
        className={`w-full text-center text-xs py-2 border-b-2 ${
          activeTab === "endpoints" ? "border-white" : "border-transparent"
        }`}
      >
        Endpoints
      </button>
      <button
        type="button"
        onClick={() => onTabChange("requests")}
        className={`w-full text-center text-xs py-2 border-b-2 ${
          activeTab === "requests" ? "border-white" : "border-transparent"
        }`}
      >
        Requests
      </button>
    </div>
  );
};

export default MobileNavigation;
