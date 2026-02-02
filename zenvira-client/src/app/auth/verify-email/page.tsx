import VerifyEmailClient from "@/components/auth/VerifyEmailClient";
import PageBanner from "@/components/PageBanner";
import { Suspense } from "react";

export const metadata = {
  title: "Verify Email | Zenvira",
  description: "Verify your email address",
};

export default function VerifyEmailPage() {
  return (
    <>
      <PageBanner
        title="Verify Email"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Verify Email" }]}
      />
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyEmailClient />
      </Suspense>
    </>
  );
}
