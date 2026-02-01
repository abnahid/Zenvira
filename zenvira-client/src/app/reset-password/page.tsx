import PageBanner from "@/components/PageBanner";
import ResetPasswordClient from "@/components/auth/ResetPasswordClient";
import { Suspense } from "react";

const page = () => {
  return (
    <div>
      <PageBanner
        title="Reset Password"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Reset Password" },
        ]}
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
        <ResetPasswordClient />
      </Suspense>
    </div>
  );
};

export default page;
