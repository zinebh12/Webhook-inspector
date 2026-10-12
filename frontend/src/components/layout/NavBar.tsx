"use client";

import { useUser } from "@/features/user/hooks/use-user.hook";

export function Navbar() {
  const { data: user } = useUser();

  return (
    <nav>
      <span>{user?.email}</span>
    </nav>
  );
}
