"use client";

import LogoutButton from "@/features/auth/components/LogoutButton";
import Image from "next/image";
import Logo from "./../../../public/logo.svg";
import SocketStatus from "@/features/socketStatus/components/SocketStatus";
export function Navbar() {
  return (
    <nav className="flex items-center justify-between p-2 border-b bg-sidebar-background border-border-default">
      <div className="flex space-x-2">
        <Image src={Logo} width={40} height={40} alt="logo" />
        <div>
          <h1 className="text-sm">Hector</h1>
          <p className="text-xs text-gray-400 ">
            Inspect and replay in real time
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <SocketStatus />
        <LogoutButton />
      </div>
    </nav>
  );
}
