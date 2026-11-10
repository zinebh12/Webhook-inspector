import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import { useDeleteEndpoint } from "../hooks/use-delete.hook";

import { useRouter, useSearchParams } from "next/navigation";
import { Endpoint } from "@/types/endpoints.types";

import { useState } from "react";
import DeleteEndpointDialog from "@/components/ui/DeleteEndpointDialog";

const DeleteBtn = ({
  id,
  firstEndpoint,
}: {
  id: string;
  firstEndpoint: Endpoint;
}) => {
  const deleteEndpointMutation = useDeleteEndpoint();

  const router = useRouter();
  const searchParams = useSearchParams();

  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("endpoint", id);

    deleteEndpointMutation.mutate(id, {
      onSuccess() {
        if (firstEndpoint) {
          router.replace(`/dashboard?endpoint=${firstEndpoint.id}`, {
            scroll: false,
          });
        } else {
          router.replace("/dashboard", {
            scroll: false,
          });
        }
      },
    });
    setOpenDialog(false);
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpenDialog(!openDialog);
        }}
        className="text-gray-400 hover:text-red-500 cursor-pointer"
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
      {openDialog && (
        <DeleteEndpointDialog
          setOpen={setOpenDialog}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default DeleteBtn;
