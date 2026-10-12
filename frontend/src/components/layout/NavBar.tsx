"use client";

import { useUser } from "@/features/user/hooks/use-user.hook";
import LogoutButton from "@/features/logout/components/LogoutButton";

export function Navbar() {
  const { data: user } = useUser();

  return (
    <nav>
      <span>{user?.email}</span>
      <LogoutButton />
    </nav>
  );
}
