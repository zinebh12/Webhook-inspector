import JsonFormatting from "@/components/ui/JsonFormatting";
import { useRequests } from "../hooks/use-requests.hook";
import { formatTimeAgo } from "@/utils/formatTimeAgo";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Requests = ({ id }: { id: string | null }) => {
  const { data: requests } = useRequests(id);

  const [showJson, setShowJson] = useState(false);

  const requestsData = requests?.data.map((d) => ({
    id: d.id,
    headers: d.headers,
    body: d.body,
    method: d.method,
    receivedAt: d.receivedAt,
  }));

  return (
    <div className="bg-card-background rounded-xl mx-4">
      {requestsData?.map((request) => (
        <div key={request.id} className=" p-4 rounded-xl space-y-4">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setShowJson(!showJson)}
          >
            <div className="space-x-1.5">
              <span className="text-sm font-semibold text-request-method bg-request-selected w-fit px-2 py-1 rounded-md">
                {request.method}
              </span>
              <span className="text-sm text-text-secondary">
                {formatTimeAgo(request.receivedAt)}
              </span>
            </div>
            <button
              className={`text-text-muted cursor-pointer transition-all ${showJson ? "rotate-180" : "rotate-0"}`}
            >
              <FontAwesomeIcon icon={faChevronDown} />
            </button>
          </div>
          {showJson && (
            <JsonFormatting
              headerObject={request.headers}
              bodyObject={request.body}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Requests;
