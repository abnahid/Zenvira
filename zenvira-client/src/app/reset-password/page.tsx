import PageBanner from "@/components/PageBanner";
import ResetPasswordClient from "@/components/auth/ResetPasswordClient";

const page = () => {
  return (
    <div>
      <PageBanner
        title="Reset Password"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Reset Password" }]}
      />
      <ResetPasswordClient />
    </div>
  );
};

export default page;
