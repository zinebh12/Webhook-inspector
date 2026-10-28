import EndpointDetails from "@/features/endpoint/components/EndpointDetails";
import { useEndpoint } from "@/features/endpoint/hooks/use-endpoint.hook";

const EndpointData = ({ endpointId }: { endpointId: string | null }) => {
  const { data: endpoint } = useEndpoint(endpointId);

  return <EndpointDetails endpoint={endpoint} />;
};

export default EndpointData;
