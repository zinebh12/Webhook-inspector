"use client";

import { useState } from "react";
import { useEndpoints } from "../hooks/use-endpoints.hook";
import { usePostEndpoint } from "../hooks/use-newEndpoint.hook";
import { useUser } from "@/features/auth/hook/use-user.hook";
import Input from "@/components/ui/Input";

const EndpointsList = () => {
  const { data: user } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    userId: user?.id,
  });
  const { data: endpoints } = useEndpoints();

  const showEndpoints = () => {
    console.log(endpoints);
  };

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
    <>
      <div onClick={showEndpoints}>EndpointsList</div>
      <form onSubmit={handleSubmit}>
        <Input
          label="name"
          type="name"
          name="name"
          placeholder="you@example.com"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <button type="submit">Add endpoint</button>
      </form>
    </>
  );
};

export default EndpointsList;
