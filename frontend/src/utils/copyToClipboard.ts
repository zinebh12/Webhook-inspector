type ToastVariant = "success" | "info" | "error";

type Toast = {
  title: string;
  message: string;
  variant: ToastVariant;
};

export const copyToClipboard = (
  clipped: string | Record<string, string> | undefined,
  toast: Toast,
  setToast: (toast: Toast) => void,
) => {
  if (clipped === undefined) return;

  const content =
    typeof clipped === "string" ? clipped : JSON.stringify(clipped, null, 2);
  navigator.clipboard.writeText(content);

  setToast(toast);
};
