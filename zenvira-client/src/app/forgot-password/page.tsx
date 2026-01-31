import PageBanner from "@/components/PageBanner";
import ForgotPasswordClient from "@/components/auth/ForgotPasswordClient";

const page = () => {
  return (
    <div>
      <PageBanner
        title="Forgot Password"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Forgot Password" }]}
      />
      <ForgotPasswordClient />
    </div>
  );
};

export default page;
