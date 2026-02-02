import PageBanner from "@/components/PageBanner";
import ShopClient from "@/components/shop/ShopClient";
import { Suspense } from "react";

const page = () => {
  return (
    <div>
      <PageBanner
        title="Shop"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        }
      >
        <ShopClient />
      </Suspense>
    </div>
  );
};

export default page;
