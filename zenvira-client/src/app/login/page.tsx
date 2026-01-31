import PageBanner from "@/components/PageBanner";
import LoginClient from "@/components/auth/LoginClient";

const page = () => {
  return (
    <div>
      <PageBanner
        title="Login"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Login" }]}
      />
      <LoginClient />
    </div>
  );
};

export default page;
