import PageBanner from "@/components/PageBanner";
import CartClient from "@/components/cart/CartClient";

export const metadata = {
  title: "Shopping Cart - Zenvira",
  description: "View your shopping cart and proceed to checkout",
};

export default function CartPage() {
  return (
    <>
      <PageBanner
        title="Cart Page"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Cart Page", href: "/cart" },
        ]}
      />
      <CartClient />
    </>
  );
}
