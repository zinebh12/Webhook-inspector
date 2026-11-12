import { formatTimeAgo } from "@/utils/formatTimeAgo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import JsonFormatting from "./JsonFormatting";
import { copyToClipboard } from "@/utils/copyToClipboard";
import { WebhookRequest } from "@/types/requests.types";
import { ToastVariant } from "./Toast";

const RequestData = ({
  allData,
  request,
  setToast,
}: {
  allData: WebhookRequest[] | undefined;
  request: Record<string, string>;
  setToast: React.Dispatch<
    React.SetStateAction<
      | {
          title: string;
          message: string;
          variant: ToastVariant;
        }
      | null
      | undefined
    >
  >;
}) => {
  const [showJson, setShowJson] = useState(false);

  return (
    <div className="bg-card-background p-4 rounded-xl space-y-4">
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
        <>
          <JsonFormatting
            headerObject={JSON.parse(request.headers)}
            bodyObject={JSON.parse(request.body)}
          />
          <button className="cursor-pointer bg-button-disabled hover:bg-button-primary-hover text-text-secondary hover:text-text-primary px-2 py-2 rounded-md flex items-center gap-1">
            <FontAwesomeIcon icon={faCopy} />
            <span
              className="text-sm font-mono"
              onClick={() => {
                copyToClipboard(
                  JSON.stringify(allData, null, 2),
                  {
                    title: "Webhook copied!",
                    message: "Your webhook was successfully copied.",
                    variant: "success",
                  },
                  setToast,
                );
              }}
            >
              Copy request
            </span>
          </button>
        </>
      )}
    </div>
  );
};

export default RequestData;
