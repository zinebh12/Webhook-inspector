"use client";

import { useState } from "react";
import { usePostEndpoint } from "../hooks/use-newEndpoint.hook";
import { useUser } from "@/features/auth/hook/use-user.hook";
import Input from "@/components/ui/Input";
import AddButton from "@/components/ui/AddButton";

const NewEndpoint = () => {
  const { data: user } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    userId: user?.id,
  });
  const endpointMutation = usePostEndpoint();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    endpointMutation.mutate(formData, {
      onSuccess() {
        console.log("Created!");
      },
    });
  };
  return (
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
      <AddButton/>
    </form>
  );
};

export default NewEndpoint;
