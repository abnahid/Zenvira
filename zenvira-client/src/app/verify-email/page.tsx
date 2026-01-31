import PageBanner from "@/components/PageBanner";
import VerifyEmailClient from "@/components/auth/VerifyEmailClient";

const page = () => {
  return (
    <div>
      <PageBanner
        title="Verify Email"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Verify Email" }]}
      />
      <VerifyEmailClient />
    </div>
  );
};

export default page;
