import {
  WebhookRequestBody,
  WebhookRequestHeaders,
} from "@/types/requests.types";

const JsonFormatting = ({
  object,
}: {
  object: WebhookRequestHeaders | WebhookRequestBody;
}) => {
  return (
    <>
      {Object.entries(object).map(([key, value]) => (
        <div key={key} className="flex gap-2 text-sm font-mono">
          <span className="text-blue-400">{`${key}:`}</span>

          <span className="break-all text-white">{String(value)}</span>
        </div>
      ))}
    </>
  );
};

export default JsonFormatting;
