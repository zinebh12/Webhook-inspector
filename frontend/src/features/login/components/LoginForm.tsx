"use client";

import { useRouter } from "next/navigation";
import { useLogin } from "../hooks/use-login.hook";
import { useState } from "react";

const LoginForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useLogin();

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate(formData, {
      onSuccess() {
        console.log("Logged in!");
        router.push("/dashboard");
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
        type="text"
        placeholder="password"
        value={formData.password}
        onChange={(e) => {
          setFormData({ ...formData, password: e.target.value });
        }}
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
