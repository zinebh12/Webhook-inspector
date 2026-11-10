import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import { useDeleteEndpoint } from "../hooks/use-delete.hook";

import { useRouter, useSearchParams } from "next/navigation";
import { Endpoint } from "@/types/endpoints.types";

const DeleteBtn = ({
  id,
}: {
  id: string;
  firstEndpoint: Endpoint;
}) => {
  const deleteEndpointMutation = useDeleteEndpoint();

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleDelete = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("endpoint", id);

    deleteEndpointMutation.mutate(id, {
      onSuccess() {
        router.replace(`/dashboard`, {
          scroll: false,
        });
      },
    });
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleDelete();
      }}
      className="text-gray-400 hover:text-red-500 cursor-pointer"
    >
      <FontAwesomeIcon icon={faTrashCan} />
    </button>
  );
};

export default DeleteBtn;
