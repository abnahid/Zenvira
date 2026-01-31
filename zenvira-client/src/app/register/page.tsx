import PageBanner from "@/components/PageBanner";
import RegisterClient from "@/components/auth/RegisterClient";

const page = () => {
  return (
    <div>
      <PageBanner
        title="Create Account"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Register" }]}
      />
      <RegisterClient />
    </div>
  );
};

export default page;
