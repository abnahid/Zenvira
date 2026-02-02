import RegisterClient from "@/components/auth/RegisterClient";
import PageBanner from "@/components/PageBanner";

export const metadata = {
  title: "Register | Zenvira",
  description: "Create a new Zenvira account",
};

export default function RegisterPage() {
  return (
    <>
      <PageBanner
        title="Register"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Register" }]}
      />
      <RegisterClient />
    </>
  );
}
