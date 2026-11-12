import { useState } from "react";

import { EndpointResponse } from "@/types/endpoints.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import IsActive from "@/features/isActive/components/IsActive";
import Toast, { ToastVariant } from "@/components/ui/Toast";

import { copyToClipboard } from "@/utils/copyToClipboard";

import DeleteBtn from "@/features/clearRequests/components/DeleteBtn";

const EndpointDetails = ({
  endpoint,
}: {
  endpoint: EndpointResponse | undefined;
}) => {
  const [toast, setToast] = useState<{
    title: string;
    message: string;
    variant: ToastVariant;
  } | null>();

  return (
    <div className="flex items-end justify-between bg-card-background w-full py-2 px-4 space-y-2 border-b border-border-default">
    <div>
        <div className="flex items-center justify-between w-full">
        <h2 className="capitalize text-text-primary text-xl font-semibold">
          {endpoint?.endpoint.name}
        </h2>
      
      </div>
      <div className="lg:flex items-end space-x-2 text-xs lg:text-sm">
        <h5 className="text-text-secondary">Webhook URL:</h5>
        <span
          onClick={() => {
            copyToClipboard(
              endpoint?.fullUrl,
              {
                title: "URL copied!",
                message: "Your webhook URL was successfully copied.",
                variant: "success",
              },
              setToast,
            );
          }}
          className="text-pink-500 font-mono hover:underline cursor-pointer"
        >
          {endpoint?.fullUrl}
        </span>
        <button
          className="cursor-pointer text-gray-400"
          onClick={() => {
            copyToClipboard(
              endpoint?.fullUrl,
              {
                title: "URL copied!",
                message: "Your webhook URL was successfully copied.",
                variant: "success",
              },
              setToast,
            );
          }}
        >
          <FontAwesomeIcon icon={faCopy} />
        </button>
        {toast && (
          <Toast
            title={toast.title}
            message={toast.message}
            variant={toast.variant}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
        <div className="space-y-3">
          <IsActive endpoint={endpoint?.endpoint} />
          <DeleteBtn id={endpoint?.endpoint.id} />
        </div>
    </div>
  );
};

export default EndpointDetails;
