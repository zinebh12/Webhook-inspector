import EndpointsList from "@/features/endpoints/components/EndpointsList";
import NewEndpoint from "@/features/newEndpoint/components/NewEndpointForm";

const SideBar = () => {
  return (
    <div className="w-full h-screen bg-sidebar-background px-2 space-y-8 md:w-1/4 md:border-r border-border-default md:pr-2">
      <NewEndpoint />
      <EndpointsList />
    </div>
  );
};

export default SideBar;
