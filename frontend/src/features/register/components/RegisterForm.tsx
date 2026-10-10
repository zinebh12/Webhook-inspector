"use client";

import { useRouter } from "next/navigation";
import { useRegister } from "../hooks/use-register.hook";
import { useState } from "react";

const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const registerMutation = useRegister();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    registerMutation.mutate(formData, {
      onSuccess() {
        console.log("Registered!");
        router.push("/login");
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="email"
        value={formData.email}
        onChange={(e) => {
          setFormData({ ...formData, email: e.target.value });
        }}
      />
      <input
        type="password"
        placeholder="password"
        value={formData.password}
        onChange={(e) => {
          setFormData({ ...formData, password: e.target.value });
        }}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;
