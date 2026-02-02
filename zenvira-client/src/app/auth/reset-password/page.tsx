import ResetPasswordClient from "@/components/auth/ResetPasswordClient";
import PageBanner from "@/components/PageBanner";
import { Suspense } from "react";

export const metadata = {
  title: "Reset Password | Zenvira",
  description: "Reset your Zenvira password",
};

export default function ResetPasswordPage() {
  return (
    <>
      <PageBanner
        title="Reset Password"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Reset Password" },
        ]}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordClient />
      </Suspense>
    </>
  );
}
