import {
  WebhookRequestBody,
  WebhookRequestHeaders,
} from "@/types/requests.types";

const JsonFormatting = ({
  headerObject,
  bodyObject,
}: {
  headerObject: WebhookRequestHeaders;
  bodyObject: WebhookRequestBody;
}) => {
  return (
    <>
      <div className="space-y-1">
        <h2 className="text-sm text-text-muted uppercase font-bold">headers</h2>
        <div className="overflow-x-auto rounded-xl bg-json-background p-4 text-xs">
          {Object.entries(headerObject).map(([key, value]) => (
            <div key={key} className="flex gap-2 text-xs md:text-sm font-mono">
              <span className="text-pink-400">{`${key}:`}</span>

              <span className="break-all text-white">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-sm text-text-muted uppercase font-bold">body</h2>
        <div className="overflow-x-auto rounded-xl bg-json-background p-4 text-xs">
          {Object.entries(bodyObject).map(([key, value]) => (
            <div key={key} className="flex gap-2 text-xs md:text-sm font-mono">
              <span className="text-pink-400">{`${key}:`}</span>

              <span className="break-all text-white">{String(value)}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default JsonFormatting;
