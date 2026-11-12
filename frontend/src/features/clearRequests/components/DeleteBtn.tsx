import { useClearHooks } from "../hooks/use-clear-requests.hook";

import Toast, { ToastVariant } from "@/components/ui/Toast";

import { useState } from "react";

const DeleteBtn = ({ id }: { id: string | undefined }) => {
  const clearHooksMutation = useClearHooks();

  const [toast, setToast] = useState<{
    title: string;
    message: string;
    variant: ToastVariant;
  } | null>();

  const handleClear = () => {
    if (!id) return;

    clearHooksMutation.mutate(id, {
      onSuccess: () => {
        setToast({
          title: "Hooks cleared!",
          message: "Your endpoint is hooks free!",
          variant: "success",
        });
      },
      onError: () => {
        setToast({
          title: "Something went wrong",
          message: "We couldn't clear the hooks. Please try again.",
          variant: "error",
        });
      },
    });
  };

  return (
    <>
      <button
        onClick={handleClear}
        className="flex items-center gap-2
    rounded-lg border border-border-default
    bg-request-background px-3 py-2
    text-sm font-medium text-request-method
    transition-all duration-200
    hover:border-border-hover
    hover:bg-card-hover
    hover:text-text-primary
    active:scale-[0.98]
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-border-focus
    focus-visible:ring-offset-2
    focus-visible:ring-offset-app-background
    cursor-pointer"
      >
        Clear all hooks
      </button>
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
