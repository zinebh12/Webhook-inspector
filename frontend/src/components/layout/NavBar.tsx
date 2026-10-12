"use client";

import { useUser } from "@/features/auth/hook/use-user.hook";
import LogoutButton from "@/features/auth/components/LogoutButton";

export function Navbar() {
  const { data: user } = useUser();

  return (
    <nav>
      <span>{user?.email}</span>
      <LogoutButton />
    </nav>
  );
}
