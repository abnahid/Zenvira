import PageBanner from "@/components/PageBanner";

export const metadata = {
  title: "Tax Information | Zenvira",
  description: "Tax information and invoice details for Zenvira purchases",
};

export default function TaxPage() {
  return (
    <>
      <PageBanner
        title="Tax Information"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Legal" },
          { label: "Tax Information" },
        ]}
      />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">Tax Information</h1>

          <p className="text-gray-600 mb-8">
            This page provides information about taxes and pricing for Zenvira
            purchases. Please review our tax policies and pricing structure
            below.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Price Display</h2>
          <p className="text-gray-600 mb-6">
            All prices displayed on Zenvira are{" "}
            <strong>exclusive of applicable taxes</strong> unless explicitly
            stated otherwise. The product listing price is the base price before
            tax calculation.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Tax Calculation</h2>
          <p className="text-gray-600 mb-6">
            Applicable local and national taxes will be calculated and added to
            your order based on:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Your delivery address location</li>
            <li>State/Province and local tax rates</li>
            <li>Product type and classification</li>
            <li>GST (Goods and Services Tax) where applicable</li>
            <li>Any additional state or municipal taxes</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Tax Checkout Display
          </h2>
          <p className="text-gray-600 mb-6">
            During checkout, you will see a detailed breakdown of:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Product subtotal (before tax)</li>
            <li>Applicable taxes and their breakdown</li>
            <li>Delivery/shipping charges (if applicable)</li>
            <li>
              <strong>Final total amount due</strong>
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Tax-Exempt Purchases
          </h2>
          <p className="text-gray-600 mb-6">
            If you are eligible for tax-exempt status (such as registered
            medical institutions or healthcare providers), you may provide
            documentation at the time of purchase. Please contact our sales team
            for details on tax-exempt ordering:
          </p>
          <p className="text-gray-600 mb-6">
            Email:{" "}
            <a
              href="mailto:tax@zenvira.com"
              className="text-emerald-600 hover:underline"
            >
              tax@zenvira.com
            </a>
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Digital Invoice</h2>
          <p className="text-gray-600 mb-6">
            A <strong>digital tax invoice</strong> will be provided with each
            order. You can:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Download your invoice from your account</li>
            <li>Receive it via email immediately after order confirmation</li>
            <li>Access it anytime from your order history</li>
            <li>Print it for your records or business use</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Invoice Contents</h2>
          <p className="text-gray-600 mb-6">Your invoice will include:</p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Invoice number and date</li>
            <li>Your billing and delivery address</li>
            <li>Itemized list of products with prices</li>
            <li>Tax breakdown by type and rate</li>
            <li>Total amount paid</li>
            <li>Payment method details</li>
            <li>Zenvira's GST/Tax ID (if applicable)</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Important Tax Information
          </h2>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-900 text-sm">
              <strong>Note:</strong> Prices and tax rates may vary by location.
              Some medicines may have reduced or zero tax rates depending on
              local regulations. The final tax amount will be calculated based
              on your delivery address at checkout.
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Price Adjustments
          </h2>
          <p className="text-gray-600 mb-6">
            If tax rates change after your order is placed, the invoice will
            reflect the tax rate at the time of order placement. Zenvira is not
            responsible for refunds due to subsequent tax rate changes.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">GST Registration</h2>
          <p className="text-gray-600 mb-6">
            <strong>Zenvira Pharmaceuticals GST ID:</strong> [Your GST Number]
          </p>
          <p className="text-gray-600 mb-6">
            For business purchases and GST-related inquiries, please include
            your GST ID or business registration number in your order notes.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Business Bulk Orders
          </h2>
          <p className="text-gray-600 mb-6">
            If you are purchasing in bulk for business purposes (hospitals,
            clinics, pharmacies), special tax rates and bulk pricing may be
            available. Please contact our business sales team:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>
              Email:{" "}
              <a
                href="mailto:business@zenvira.com"
                className="text-emerald-600 hover:underline"
              >
                business@zenvira.com
              </a>
            </li>
            <li>Phone: +1-800-ZENVIRA (Ext. Business Sales)</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Tax Payment Methods
          </h2>
          <p className="text-gray-600 mb-6">
            Taxes are collected as part of your total order amount. For COD
            orders, the total amount (including tax) is due at delivery.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Transparency & Compliance
          </h2>
          <p className="text-gray-600 mb-6">Zenvira is committed to:</p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Transparent tax calculation and display</li>
            <li>Compliance with all local and national tax regulations</li>
            <li>Accurate invoicing and record-keeping</li>
            <li>Supporting your tax and accounting requirements</li>
          </ul>

          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 mt-8">
            <p className="text-sm text-gray-600">
              <strong>Last Updated:</strong> February 2, 2026
            </p>
            <p className="text-sm text-gray-600 mt-4">
              <strong>Tax-related questions?</strong> Contact our support team:
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Email:{" "}
              <a
                href="mailto:tax@zenvira.com"
                className="text-emerald-600 hover:underline"
              >
                tax@zenvira.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
