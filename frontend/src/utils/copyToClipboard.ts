type ToastVariant = "success" | "info" | "error";

export const copyToClipboard = (
  clipped: string | undefined,
  setToast: (toast: {
    title: string;
    message: string;
    variant: ToastVariant;
  }) => void
) => {
  if (clipped) {
    navigator.clipboard.writeText(clipped);
  }

  setToast({
    title: "URL copied!",
    message: "Your webhook URL was successfully copied.",
    variant: "success",
  });
};
