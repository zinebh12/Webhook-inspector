import {
  WebhookRequestBody,
  WebhookRequestHeaders,
} from "@/types/requests.types";

const JsonFormatting = ({
  id,
  method,
  query,
  statusCode,
  ip,
  headerObject,
  bodyObject,
}: {
  id: string;
  method: string;
  query: string;
  statusCode: string;
  ip: string;
  headerObject: WebhookRequestHeaders;
  bodyObject: WebhookRequestBody;
}) => {
  const requestObject = {
    id: id,
    method: method,
    statusCode: statusCode,
    ip: ip,
    query: query,
  };

  return (
    <div className="animate-in slide-in-from-top-3 fade-in duration-300 mt-6 space-y-3">
      <div className="space-y-1 w-full">
        <h2 className="text-sm text-text-muted uppercase font-bold">Request info</h2>
        <div className="overflow-x-auto rounded-xl bg-json-background p-4 text-xs">
          {Object.entries(requestObject).map(([key, value]) => (
            <div key={key} className="flex text-xs md:text-sm font-mono">
              <span className="text-pink-400">{`${key}:`}</span>

              {value !== null && typeof value === "object" ? (
                <pre>{JSON.stringify(value, null, 2)}</pre>
              ) : (
                <span className="ml-2 break-all text-white">
                  {value === null ? "null" : String(value)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1 w-full">
        <h2 className="text-sm text-text-muted uppercase font-bold">headers</h2>
        <div className="overflow-x-auto rounded-xl bg-json-background p-4 text-xs">
          {Object.entries(headerObject).map(([key, value]) => (
            <div key={key} className="flex gap-2 text-xs md:text-sm font-mono">
              <span className="text-pink-400">{`${key}:`}</span>

              <span className="break-all text-white">{`${value}`}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-sm text-text-muted uppercase font-bold">body</h2>
        <div className="overflow-x-auto overflow-y-scroll h-50 scrollbar-thin scrollbar-thumb-pink-700 scrollbar-track-json-background hover:scrollbar-thumb-pink-500 rounded-xl bg-json-background p-4 text-xs">
          {Object.entries(bodyObject).map(([key, value]) => (
            <div key={key} className="flex text-xs md:text-sm font-mono">
              <span className="text-pink-400">{`${key}:`}</span>

              {value !== null && typeof value === "object" ? (
                <pre>{JSON.stringify(value, null, 2)}</pre>
              ) : (
                <span className="ml-2 break-all text-white">
                  {value === null ? "null" : String(value)}
                </span>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default JsonFormatting;
