import { EndpointResponse } from "@/types/endpoints.types";
import { usePatchEndpoint } from "../hooks/use-active.hook";
import { useQueryClient } from "@tanstack/react-query";

const IsActive = ({ endpoint }: Partial<EndpointResponse> = {}) => {
  const queryClient = useQueryClient();

  const patchActive = usePatchEndpoint();

  const toggleActivity = () => {
    const nextIsActive = !endpoint?.isActive;
    patchActive.mutate(
      { id: endpoint?.id ?? "", isActive: nextIsActive },
      {
        onSuccess() {
          queryClient.invalidateQueries({
            queryKey: ["endpoints"],
          });
        },
      },
    );
  };

  return (
    <div
      onClick={toggleActivity}
      role="button"
      tabIndex={0}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 
    text-xs font-medium cursor-pointer transition-all duration-200
    ${
      endpoint?.isActive
        ? "border-status-success/30 bg-status-success/10 text-status-success hover:bg-status-success/15"
        : "border-status-error/30 bg-status-error/10 text-status-error hover:bg-status-error/15"
    }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          endpoint?.isActive ? "bg-status-success" : "bg-status-error"
        }`}
      />
      {endpoint?.isActive ? "Active" : "Disabled"}
    </div>
  );
};

export default IsActive;
