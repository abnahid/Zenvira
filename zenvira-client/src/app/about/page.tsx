import AboutClient from "@/components/about/AboutClient";
import PageBanner from "@/components/PageBanner";

const page = () => {
  return (
    <div>
      <PageBanner
        title="About Page"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Page", href: "/about" },
        ]}
      />
      <AboutClient />
    </div>
  );
};

export default page;
