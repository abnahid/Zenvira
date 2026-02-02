import PageBanner from "@/components/PageBanner";

export const metadata = {
  title: "Shipping & Delivery Policy | Zenvira",
  description: "Learn about Zenvira's shipping and delivery policies",
};

export default function ShippingPage() {
  return (
    <>
      <PageBanner
        title="Shipping & Delivery"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Legal" },
          { label: "Shipping & Delivery" },
        ]}
      />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">
            Shipping & Delivery Policy
          </h1>

          <p className="text-gray-600 mb-8">
            Zenvira is committed to delivering your orders efficiently and
            safely. Please review our shipping policies below.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Delivery Coverage
          </h2>
          <p className="text-gray-600 mb-6">
            We deliver products to addresses throughout the country. Delivery is
            available to most cities and towns. Some remote areas may have
            extended delivery times or may not be available for delivery.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Delivery Timeline
          </h2>
          <p className="text-gray-600 mb-4">
            <strong>Estimated delivery time: 2–5 business days</strong> from the
            date of order placement.
          </p>
          <p className="text-gray-600 mb-6">
            Delivery times may vary depending on:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Geographic location and accessibility</li>
            <li>Weather conditions</li>
            <li>Public holidays and weekends</li>
            <li>Order volume during peak seasons</li>
            <li>Product availability</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Payment Method</h2>
          <p className="text-gray-600 mb-6">
            Zenvira currently supports <strong>Cash on Delivery (COD)</strong>{" "}
            only. This means:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Payment is collected at the time of delivery</li>
            <li>You can inspect products before making payment</li>
            <li>Payment must be made in full during delivery</li>
            <li>
              Only cash and digital payment methods are accepted at delivery
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Delivery Address</h2>
          <p className="text-gray-600 mb-6">
            Please provide a complete and accurate delivery address at checkout:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Full name and contact number</li>
            <li>Detailed street address with landmarks</li>
            <li>City, postal code, and state</li>
            <li>
              Alternative contact number for delivery coordination (optional but
              recommended)
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Failed Deliveries
          </h2>
          <p className="text-gray-600 mb-6">
            If delivery fails due to the following reasons, the order may be
            cancelled or redelivery may be attempted:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Incorrect or incomplete address</li>
            <li>Recipient unavailable at delivery location</li>
            <li>Address inaccessible for delivery vehicle</li>
            <li>Recipient refuses to accept the order</li>
            <li>Unsafe or unreachable delivery location</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Redelivery Attempts
          </h2>
          <p className="text-gray-600 mb-6">
            If initial delivery fails, we will attempt redelivery based on
            customer contact. After 2 failed delivery attempts, the order may be
            cancelled, and a refund will be initiated.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Order Tracking</h2>
          <p className="text-gray-600 mb-6">
            Once your order is shipped, you will receive a tracking ID via email
            and SMS. You can track your order status through your account
            dashboard.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Product Condition at Delivery
          </h2>
          <p className="text-gray-600 mb-6">
            Please inspect all products at the time of delivery for:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Damage or tampering</li>
            <li>Expiry date and batch numbers</li>
            <li>Correct items and quantities</li>
            <li>Proper packaging and sealing</li>
          </ul>
          <p className="text-gray-600 mb-6">
            If you receive damaged or incorrect items, report it to our customer
            service team within 24 hours of delivery.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Special Handling</h2>
          <p className="text-gray-600 mb-6">
            Medicines and healthcare products are handled with care to maintain
            their integrity. Products are delivered in secure packaging to
            prevent damage during transit.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Delivery Refusal</h2>
          <p className="text-gray-600 mb-6">
            If you refuse delivery, the product will be returned to our
            warehouse, and the order will be cancelled. Refunds will be
            processed after the item is returned and inspected.
          </p>

          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 mt-8">
            <p className="text-sm text-gray-600">
              <strong>Last Updated:</strong> February 2, 2026
            </p>
            <p className="text-sm text-gray-600 mt-2">
              For shipping-related queries, contact us at{" "}
              <a
                href="mailto:shipping@zenvira.com"
                className="text-emerald-600 hover:underline"
              >
                shipping@zenvira.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
