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
    <div className="space-x-2">
      <span
        className={`inline-block w-2 h-2 rounded-full ${endpoint?.isActive ? " bg-green-500" : "bg-red-500"}`}
      />
      <span className="text-xs cursor-pointer" onClick={toggleActivity}>
        {endpoint?.isActive ? "Live" : "Off"}
      </span>
    </div>
  );
};

export default IsActive;
