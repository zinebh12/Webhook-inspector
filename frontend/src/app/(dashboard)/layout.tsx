import { Suspense } from "react";

import { Navbar } from "@/components/layout/NavBar";
import { SearchProvider } from "@/lib/search.context";
const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-[#0b1220] text-white">
      <Suspense>
        <SearchProvider>
          <Navbar /> {children}
        </SearchProvider>
      </Suspense>
    </main>
  );
};

export default layout;
