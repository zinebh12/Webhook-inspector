"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

type DeleteEndpointDialogProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onConfirm: () => void;
  isDeleting?: boolean;
};

const DeleteEndpointDialog = ({
  setOpen,
  onConfirm,
}: DeleteEndpointDialogProps) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
      onClick={() => {
        setOpen(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-900 p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
            <FontAwesomeIcon icon={faTriangleExclamation} className="text-lg" />
          </div>

          <button
            onClick={() => {
              setOpen(false);
            }}
            className="cursor-pointer text-gray-500 transition hover:text-white"
            aria-label="Close dialog"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {/* Content */}
        <h2 id="delete-title" className="mb-2 text-lg font-semibold text-white">
          Delete endpoint?
        </h2>

        <p className="text-sm leading-relaxed text-gray-400">
          Are you sure you want to delete this endpoint? This action cannot be
          undone.
        </p>

        {/* Actions */}
        <div className="mt-7 flex justify-end gap-3">
          <button
            onClick={() => {
              setOpen(false);
            }}
            className="cursor-pointer rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-800 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="cursor-pointer flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEndpointDialog;
