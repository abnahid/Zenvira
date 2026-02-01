import PageBanner from "@/components/PageBanner";
import VerifyEmailClient from "@/components/auth/VerifyEmailClient";
import { Suspense } from "react";

const page = () => {
  return (
    <div>
      <PageBanner
        title="Verify Email"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Verify Email" }]}
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
        <VerifyEmailClient />
      </Suspense>
    </div>
  );
};

export default page;
