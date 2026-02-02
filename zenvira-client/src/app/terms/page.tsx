import PageBanner from "@/components/PageBanner";

export const metadata = {
  title: "Terms & Conditions | Zenvira",
  description: "Terms and conditions for using Zenvira online medicine store",
};

export default function TermsPage() {
  return (
    <>
      <PageBanner
        title="Terms & Conditions"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Legal" },
          { label: "Terms & Conditions" },
        ]}
      />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>

          <p className="text-gray-600 mb-8">
            By accessing and using the Zenvira website, you agree to the
            following terms and conditions. These terms apply to all users,
            including customers, sellers, and administrators.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Use of Services</h2>
          <p className="text-gray-600 mb-6">
            Zenvira allows users to browse and purchase over-the-counter (OTC)
            medicines and healthcare products. Prescription medicines are not
            sold through this platform. All products sold are subject to local
            regulations and laws.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">User Accounts</h2>
          <p className="text-gray-600 mb-6">
            You are responsible for maintaining the confidentiality of your
            account credentials. Zenvira is not responsible for any activity
            that occurs under your account. If you suspect unauthorized access,
            please contact us immediately.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Product Information
          </h2>
          <p className="text-gray-600 mb-6">
            We strive to ensure all product details, prices, and availability
            are accurate. However, errors may occur, and we reserve the right to
            correct them without prior notice. Product images are for reference
            only and may vary slightly from actual products.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Orders</h2>
          <p className="text-gray-600 mb-6">
            All orders are subject to acceptance and availability. Zenvira
            reserves the right to cancel or refuse any order. Order
            confirmations are sent via email upon successful placement.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Limitation of Liability
          </h2>
          <p className="text-gray-600 mb-6">
            Zenvira is not liable for any indirect, incidental, special, or
            consequential damages arising from the use of products purchased
            through this platform. Use of products is at your own risk.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Modifications</h2>
          <p className="text-gray-600 mb-6">
            Zenvira may update these terms at any time. Continued use of the
            platform indicates acceptance of the updated terms. We recommend
            reviewing these terms periodically for changes.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Governing Law</h2>
          <p className="text-gray-600 mb-6">
            These terms and conditions are governed by and construed in
            accordance with applicable local and national laws. Any disputes
            shall be resolved through appropriate legal channels.
          </p>

          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 mt-8">
            <p className="text-sm text-gray-600">
              <strong>Last Updated:</strong> February 2, 2026
            </p>
            <p className="text-sm text-gray-600 mt-2">
              If you have questions about these terms, please contact us at{" "}
              <a
                href="mailto:legal@zenvira.com"
                className="text-emerald-600 hover:underline"
              >
                legal@zenvira.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
