import ForgotPasswordClient from "@/components/auth/ForgotPasswordClient";
import PageBanner from "@/components/PageBanner";

export const metadata = {
  title: "Forgot Password | Zenvira",
  description: "Reset your Zenvira password",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <PageBanner
        title="Forgot Password"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Forgot Password" },
        ]}
      />
      <ForgotPasswordClient />
    </>
  );
}
