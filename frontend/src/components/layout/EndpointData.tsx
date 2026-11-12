import EndpointDetails from "@/features/endpoint/components/EndpointDetails";
import { useEndpoint } from "@/features/endpoint/hooks/use-endpoint.hook";
import Requests from "@/features/requests/components/Requests";

const EndpointData = ({ endpointId }: { endpointId: string | null }) => {
  const { data: endpoint } = useEndpoint(endpointId);

  return (
    <div className="flex flex-col w-full space-y-4">
      <EndpointDetails endpoint={endpoint} />
      <Requests id={endpointId} />
    </div>
  );
};

export default EndpointData;
