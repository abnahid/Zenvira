import PageBanner from "@/components/PageBanner";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata = {
  title: "Checkout - Zenvira",
  description: "Complete your order",
};

export default function CheckoutPage() {
  return (
    <>
      <PageBanner
        title="Checkout"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cart", href: "/cart" },
          { label: "Checkout", href: "/checkout" },
        ]}
      />
      <CheckoutClient />
    </>
  );
}
