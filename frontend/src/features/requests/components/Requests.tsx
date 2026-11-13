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
    method: d.method,
    statusCode: d.statusCode,
    ip: d.ip,
    query: d.query,
    headers: d.headers,
    body: d.body,
    receivedAt: d.receivedAt,
  }));

  const allData = requests?.data.map((d) => d);

  return (
    <div
      className="mx-4 space-y-4"
      onClick={() => {
        console.log(requests?.data[0]);
      }}
    >
      {requestsData?.map((request) => (
        <RequestData
          key={request.id}
          request={{
            id: request.id,
            statusCode: request.statusCode.toString(),
            ip: request.ip,
            query: JSON.stringify(request.query),
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
