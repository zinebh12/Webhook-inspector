"use client";

import { useRouter } from "next/navigation";
import { useRegister } from "../hooks/use-register.hook";
import { useState } from "react";
import FormButton from "@/components/ui/FormButton";
import FormHeader from "@/components/ui/FormHeader";
import Input from "@/components/ui/Input";

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
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-md h-full lg:h-screen flex-col gap-6 rounded-2xl p-8 text-white"
    >
      {/* Logo and branding */}
      <FormHeader />
      <div className="h-px bg-linear-r from-transparent via-blue-800 to-transparent" />

      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Create your account
        </h2>
        <p className="text-sm text-slate-400">
          Start inspecting your webhooks in real time.
        </p>
      </div>

      {/* Email */}
      <Input
        label="Email address"
        type="email"
        name="email"
        placeholder="you@example.com"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      {/* Password */}
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        placeholder="Enter a password"
        required
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      {/* Submit */}
      <FormButton BtnFunction={"Create an account"} />

      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-medium text-blue-400 transition hover:text-blue-300 hover:underline"
        >
          Log in
        </a>
      </p>

      <p className="text-center text-xs text-slate-600">
        Built for developers. Designed for debugging.
      </p>
    </form>
  );
};

export default RegisterForm;
