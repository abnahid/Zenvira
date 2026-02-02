"use client";

import PageBanner from "@/components/PageBanner";
import SellerApplicationClient from "@/components/dashboard/SellerApplicationClient";

export default function BecomeSellerPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageBanner
        title="Become Seller"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Become Seller", href: "/become-seller" },
        ]}
      />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <SellerApplicationClient />
      </div>
    </div>
  );
}
