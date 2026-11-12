import { useRequests } from "../hooks/use-requests.hook";

import { useState } from "react";
import Toast, { ToastVariant } from "@/components/ui/Toast";
import RequestData from "@/components/ui/RequestData";

const Requests = ({ id }: { id: string | null }) => {
  const { data: requests } = useRequests(id);

  const [toast, setToast] = useState<{
    title: string;
    message: string;
    variant: ToastVariant;
  } | null>();

  const requestsData = requests?.data.map((d) => ({
    id: d.id,
    headers: d.headers,
    body: d.body,
    method: d.method,
    receivedAt: d.receivedAt,
  }));

  const allData = requests?.data.map((d) => d);

  return (
    <div className="mx-4 space-y-4">
      {requestsData?.map((request) => (
        <RequestData
          key={request.id}
          request={{
            id: request.id,
            headers: JSON.stringify(request.headers),
            body: JSON.stringify(request.body),
            method: request.method,
            receivedAt: request.receivedAt,
          }}
          allData={allData}
          setToast={setToast}
        />
      ))}
      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Requests;
