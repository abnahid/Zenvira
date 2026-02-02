import PageBanner from "@/components/PageBanner";

export const metadata = {
  title: "Refund & Returns Policy | Zenvira",
  description: "Learn about Zenvira's refund and returns policies",
};

export default function RefundPage() {
  return (
    <>
      <PageBanner
        title="Refund & Returns"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Legal" },
          { label: "Refund & Returns" },
        ]}
      />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">Refund & Returns Policy</h1>

          <p className="text-gray-600 mb-8">
            We want you to be completely satisfied with your purchase. Please
            review our returns and refund policies below.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Returns Eligibility
          </h2>
          <p className="text-gray-600 mb-6">
            You may return products under the following conditions:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Products are returned within 3 days of delivery</li>
            <li>Product packaging is intact and undamaged</li>
            <li>Product seal has not been broken or tampered with</li>
            <li>Product is not expired</li>
            <li>Product was damaged during delivery</li>
            <li>Wrong item was delivered</li>
            <li>Incorrect quantity was delivered</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Non-Returnable Items
          </h2>
          <p className="text-gray-600 mb-6">
            The following items cannot be returned:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Products with opened or damaged packaging</li>
            <li>Products with broken seals</li>
            <li>Expired products</li>
            <li>Products used or consumed</li>
            <li>Products returned after 3 days of delivery</li>
            <li>Products without original packaging</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Return Process</h2>
          <p className="text-gray-600 mb-6">
            To initiate a return, follow these steps:
          </p>
          <ol className="list-decimal list-inside text-gray-600 mb-6 space-y-2">
            <li>Log in to your Zenvira account</li>
            <li>Navigate to "Orders" and select the order</li>
            <li>Click "Return Item" and select the reason</li>
            <li>Follow the instructions to generate a return label</li>
            <li>Pack the product securely with original packaging</li>
            <li>Drop off the package at the designated pickup point</li>
          </ol>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Return Shipping</h2>
          <p className="text-gray-600 mb-6">
            <strong>Return shipping is FREE</strong> for damaged or incorrectly
            delivered items. For other returns, return shipping charges may
            apply based on the reason for return. Zenvira will provide a prepaid
            return label for eligible returns.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Inspection Process
          </h2>
          <p className="text-gray-600 mb-6">
            Once we receive your returned item, we will:
          </p>
          <ol className="list-decimal list-inside text-gray-600 mb-6 space-y-2">
            <li>Verify receipt of the item within 1 business day</li>
            <li>Inspect the product condition and packaging</li>
            <li>Confirm eligibility for refund within 2-3 business days</li>
            <li>Process the refund if all conditions are met</li>
          </ol>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Refunds</h2>
          <p className="text-gray-600 mb-6">
            <strong>Refund Processing:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>
              For COD orders: Refunds are issued as store credit or bank
              transfer
            </li>
            <li>
              Refunds are processed within 5-7 business days after inspection
            </li>
            <li>
              The refund amount equals the product cost (excludes delivery
              charges)
            </li>
            <li>Bank transfers may take an additional 2-3 days to reflect</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Refund Request Timeline
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>
                <strong>Days 1-3:</strong> Initiate return request
              </li>
              <li>
                <strong>Days 4-5:</strong> Ship the item back to us
              </li>
              <li>
                <strong>Days 6-8:</strong> Item inspection
              </li>
              <li>
                <strong>Days 9-15:</strong> Refund processing and approval
              </li>
              <li>
                <strong>Days 16-20:</strong> Refund received (for bank
                transfers)
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Damaged or Defective Products
          </h2>
          <p className="text-gray-600 mb-6">
            If you receive a damaged, defective, or expired product:
          </p>
          <ol className="list-decimal list-inside text-gray-600 mb-6 space-y-2">
            <li>Do NOT use or consume the product</li>
            <li>Contact customer service within 24 hours of delivery</li>
            <li>Provide photos of the damage and packaging</li>
            <li>We will arrange a replacement or full refund</li>
          </ol>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Replacement vs. Refund
          </h2>
          <p className="text-gray-600 mb-6">
            For damaged or incorrect items, you can choose either:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>
              <strong>Replacement:</strong> We send a replacement product at no
              cost
            </li>
            <li>
              <strong>Refund:</strong> We process a full refund to your
              preferred method
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Exceptions & Limitations
          </h2>
          <p className="text-gray-600 mb-6">
            Zenvira reserves the right to refuse returns or refunds if:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>The return request is made after 3 days of delivery</li>
            <li>The product has been used or consumed</li>
            <li>The packaging is damaged or tampered with</li>
            <li>There is evidence of fraudulent return</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Support</h2>
          <p className="text-gray-600 mb-6">
            If you have questions about returns or need assistance, contact our
            support team:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>
              Email:{" "}
              <a
                href="mailto:returns@zenvira.com"
                className="text-emerald-600 hover:underline"
              >
                returns@zenvira.com
              </a>
            </li>
            <li>Phone: +1-800-ZENVIRA</li>
            <li>Chat: Available 24/7 on our website</li>
          </ul>

          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 mt-8">
            <p className="text-sm text-gray-600">
              <strong>Last Updated:</strong> February 2, 2026
            </p>
            <p className="text-sm text-gray-600 mt-2">
              We're committed to providing excellent customer service. If you
              have any concerns about your order, don't hesitate to reach out.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
