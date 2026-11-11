"use client";

import { useState } from "react";
import { usePostEndpoint } from "../hooks/use-newEndpoint.hook";
import { useUser } from "@/features/auth/hook/use-user.hook";
import Input from "@/components/ui/Input";
import AddButton from "@/components/ui/AddButton";
import Toast, { ToastVariant } from "@/components/ui/Toast";

const NewEndpoint = () => {
  const { data: user } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    userId: user?.id,
  });

  const [toast, setToast] = useState<{
    title: string;
    message: string;
    variant: ToastVariant;
  } | null>();

  const endpointMutation = usePostEndpoint();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    endpointMutation.mutate(formData, {
      onSuccess: () => {
        setToast({
          title: "Endpoint created!",
          message: "Your endpoint was successfully created.",
          variant: "success",
        });
      },
      onError: () => {
        setToast({
          title: "Something went wrong",
          message: "We couldn't create this endpoint. Please try again.",
          variant: "error",
        });
      },
    });
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          label=""
          type="name"
          name="name"
          placeholder="Endpoint name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <AddButton />
      </form>
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

export default NewEndpoint;
