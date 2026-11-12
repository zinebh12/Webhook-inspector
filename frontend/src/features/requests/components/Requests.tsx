import JsonFormatting from "@/components/ui/JsonFormatting";
import { useRequests } from "../hooks/use-requests.hook";
import { formatTimeAgo } from "@/utils/formatTimeAgo";

const Requests = ({ id }: { id: string | null }) => {
  const { data: requests } = useRequests(id);

  const requestsData = requests?.data.map((d) => ({
    id: d.id,
    headers: d.headers,
    body: d.body,
    method: d.method,
    receivedAt: d.receivedAt,
  }));

  return (
    <>
      {requestsData?.map((request) => (
        <div key={request.id} className="bg-gray-800 p-4 rounded-xl space-y-4">
          <div className=" space-x-1.5">
            <span className="text-sm font-semibold text-blue-500 bg-cyan-900 w-fit px-2 py-1 rounded-md">
              {request.method}
            </span>
            <span className="text-sm text-gray-400">
              {formatTimeAgo(request.receivedAt)}
            </span>
          </div>
          <div className="space-y-1">
            <h2 className="text-sm text-gray-400 uppercase font-bold">
              Headers
            </h2>
            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#03003b] p-4 text-xs">
              <JsonFormatting object={request.headers} />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-sm text-gray-400 uppercase font-bold">body</h2>
            <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#03003b] p-4 text-xs">
              <JsonFormatting object={request.body} />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default Requests;
