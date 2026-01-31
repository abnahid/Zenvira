import PageBanner from "@/components/PageBanner";
import ShopClient from "@/components/shop/ShopClient";

const page = () => {
  return (
    <div>
      <PageBanner
        title="Shop"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      />
      <ShopClient />
    </div>
  );
};

export default page;
