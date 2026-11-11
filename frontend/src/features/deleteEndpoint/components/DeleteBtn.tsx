import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

import { useDeleteEndpoint } from "../hooks/use-delete.hook";

import { useRouter, useSearchParams } from "next/navigation";
import { Endpoint } from "@/types/endpoints.types";

import { useState } from "react";
import DeleteEndpointDialog from "@/components/ui/DeleteEndpointDialog";

import Toast, { ToastVariant } from "@/components/ui/Toast";

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

  const [toast, setToast] = useState<{
    title: string;
    message: string;
    variant: ToastVariant;
  } | null>();

  const handleDelete = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("endpoint", id);

    deleteEndpointMutation.mutate(id, {
      onSuccess: () => {
        setToast({
          title: "Endpoint deleted!",
          message: "Your endpoint was successfully deleted.",
          variant: "success",
        });

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
      onError: () => {
        setToast({
          title: "Something went wrong",
          message: "We couldn't delete this endpoint. Please try again.",
          variant: "error",
        });
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

      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          variant={toast.variant}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default DeleteBtn;
