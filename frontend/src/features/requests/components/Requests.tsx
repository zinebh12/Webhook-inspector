import { useRequests } from "../hooks/use-requests.hook";

import { useEffect } from "react";

import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-json";

const Requests = ({ id }: { id: string | null }) => {
  const { data: requests } = useRequests(id);

  const headers = requests?.data.map((d) => d.headers);
  const method = requests?.data.map((d) => d.method);

  const json = JSON.stringify(headers, null, 2);

  useEffect(() => {
    Prism.highlightAll();
  }, [json]);

  return (
    <div className="bg-gray-800 p-4 rounded-xl space-y-4">
      <p className="text-sm text-blue-500 bg-cyan-900 w-fit px-2 py-.5 rounded-md">
        {method}
      </p>
      <div className="space-y-1">
        <h2 className="text-sm text-gray-400 uppercase font-bold">Headers</h2>
        <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#03003b] p-4 text-xs">
          {headers &&
            Object.entries(headers[0]).map(([key, value]) => (
              <div key={key} className="flex gap-2 text-sm font-mono">
                <span className="text-blue-400">{`${key}:`}</span>

                <span className="break-all text-white">{`${value}`}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Requests;
