import LoginClient from "@/components/auth/LoginClient";
import PageBanner from "@/components/PageBanner";

export const metadata = {
  title: "Login | Zenvira",
  description: "Login to your Zenvira account",
};

export default function LoginPage() {
  return (
    <>
      <PageBanner
        title="Login"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Login" }]}
      />
      <LoginClient />
    </>
  );
}
