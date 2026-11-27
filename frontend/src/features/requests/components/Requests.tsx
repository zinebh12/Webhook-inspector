import { useRequests } from "../hooks/use-requests.hook";
import { useNewRequestSocket } from "../hooks/new-request-socket.hook";

import { useState } from "react";
import Toast, { ToastVariant } from "@/components/ui/Toast";
import RequestData from "@/components/ui/RequestData";
import { UseSearchContext } from "@/lib/search.context";
import Pagination from "@/features/pagination/components/Pagination";

const Requests = ({ id }: { id: string | null }) => {
  useNewRequestSocket(id);
  const [currentPage, setCurrentPage] = useState(1);

  const { search } = UseSearchContext();

  const { data: requests } = useRequests(id, search, currentPage);

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
    <div className="mx-4 space-y-4">
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
      <Pagination
        requests={requests}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
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
