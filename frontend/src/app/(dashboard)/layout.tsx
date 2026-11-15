import { Suspense } from "react";

import { Navbar } from "@/components/layout/NavBar";
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-[#0b1220] text-white">
      <Suspense>
        <Navbar /> {children}
      </Suspense>
    </main>
  );
};

export default layout;
