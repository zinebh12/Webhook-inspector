import { EndpointResponse } from "@/types/endpoints.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

const EndpointDetails = ({
  endpoint,
}: {
  endpoint: EndpointResponse | undefined;
}) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(endpoint?.fullUrl);
  };

  return (
    <div className="bg-gray-800 w-full p-2 space-y-2" >
      <h2 className="capitalize text-xl font-semibold">{endpoint?.endpoint.name}</h2>
      <div className="flex space-x-2 text-sm">
        <h5 className="text-gray-400">Webhook URL:</h5>
        <span
          onClick={copyToClipboard}
          className="text-blue-500 hover:underline cursor-pointer text-xs"
        >
          {endpoint?.fullUrl}
        </span>
        <button className="cursor-pointer text-gray-400" onClick={copyToClipboard}>
          <FontAwesomeIcon icon={faCopy} />
        </button>
      </div>
    </div>
  );
};

export default EndpointDetails;
