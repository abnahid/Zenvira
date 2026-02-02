import PageBanner from "@/components/PageBanner";

export const metadata = {
  title: "Privacy Policy | Zenvira",
  description: "Privacy policy and data protection information for Zenvira",
};

export default function PrivacyPage() {
  return (
    <>
      <PageBanner
        title="Privacy Policy"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Legal" },
          { label: "Privacy Policy" },
        ]}
      />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

          <p className="text-gray-600 mb-8">
            Zenvira respects your privacy and is committed to protecting your
            personal information. This privacy policy explains how we collect,
            use, and safeguard your data.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Information We Collect
          </h2>
          <p className="text-gray-600 mb-4">
            We collect the following types of information:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Name, email address, and phone number</li>
            <li>Shipping and billing address</li>
            <li>Order history and purchase details</li>
            <li>Account activity and preferences</li>
            <li>Payment information (processed securely)</li>
            <li>
              Browser and device information (cookies and tracking technologies)
            </li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Use of Information
          </h2>
          <p className="text-gray-600 mb-4">We use your information to:</p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Process and deliver your orders</li>
            <li>Provide customer support and respond to inquiries</li>
            <li>Send order confirmations and updates</li>
            <li>Improve our products and services</li>
            <li>Personalize your shopping experience</li>
            <li>Comply with legal obligations</li>
            <li>Prevent fraud and ensure platform security</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
          <p className="text-gray-600 mb-6">
            We use secure systems and industry-standard practices to protect
            your data. Passwords are encrypted and never stored in plain text.
            All payment information is processed through secure, PCI-compliant
            channels. We regularly update our security protocols to prevent
            unauthorized access.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Sharing Your Information
          </h2>
          <p className="text-gray-600 mb-6">
            We do not sell your personal information to third parties. Your
            information may be shared with trusted partners only for the purpose
            of delivering services (e.g., shipping, payment processing). All
            partners are bound by confidentiality agreements.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies</h2>
          <p className="text-gray-600 mb-6">
            Zenvira uses cookies to enhance your browsing experience. You can
            disable cookies in your browser settings, but this may affect
            platform functionality.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
          <p className="text-gray-600 mb-6">
            You have the right to access, update, or delete your personal
            information at any time. To exercise these rights, contact us at the
            email address provided below.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Third-Party Links
          </h2>
          <p className="text-gray-600 mb-6">
            Our website may contain links to third-party websites. We are not
            responsible for the privacy practices of external sites. Please
            review their privacy policies before sharing information.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Policy Changes</h2>
          <p className="text-gray-600 mb-6">
            We may update this privacy policy periodically. Significant changes
            will be communicated via email or prominently displayed on the
            website.
          </p>

          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 mt-8">
            <p className="text-sm text-gray-600">
              <strong>Last Updated:</strong> February 2, 2026
            </p>
            <p className="text-sm text-gray-600 mt-2">
              For privacy-related inquiries, contact us at{" "}
              <a
                href="mailto:privacy@zenvira.com"
                className="text-emerald-600 hover:underline"
              >
                privacy@zenvira.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
