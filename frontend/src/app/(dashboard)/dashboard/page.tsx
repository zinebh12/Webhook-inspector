import DashboardContent from "@/components/layout/DashboardContent";

import { Suspense } from "react";

const Page = () => {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  );
};

export default Page;
