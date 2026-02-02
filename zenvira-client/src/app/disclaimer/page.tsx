import PageBanner from "@/components/PageBanner";

export const metadata = {
  title: "Medical Disclaimer | Zenvira",
  description:
    "Medical disclaimer and important health information for Zenvira",
};

export default function DisclaimerPage() {
  return (
    <>
      <PageBanner
        title="Medical Disclaimer"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Legal" },
          { label: "Medical Disclaimer" },
        ]}
      />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="prose max-w-none">
          <h1 className="text-3xl font-bold mb-6">Medical Disclaimer</h1>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8">
            <p className="text-red-800 font-semibold">
              ⚠️ IMPORTANT: Zenvira sells over-the-counter (OTC) medicines only.
              This disclaimer is critical to your health and safety.
            </p>
          </div>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Medical Notice</h2>
          <p className="text-gray-600 mb-6">
            The information provided on this website, including product
            descriptions, usage instructions, and health-related content, is for
            general informational purposes only and does not constitute
            professional medical advice.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Consult a Healthcare Professional
          </h2>
          <p className="text-gray-600 mb-6">
            <strong>Always consult a licensed healthcare professional</strong>{" "}
            before using any medication, particularly if you:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Are pregnant or nursing</li>
            <li>Have existing medical conditions</li>
            <li>Are taking other medications or supplements</li>
            <li>Have allergies to medication ingredients</li>
            <li>Are under the care of a physician for any condition</li>
            <li>Experience symptoms that persist or worsen</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Product Limitations
          </h2>
          <p className="text-gray-600 mb-6">
            Zenvira only sells OTC (over-the-counter) medicines and healthcare
            products. Prescription medications are NOT available on this
            platform. If you require prescription medicine, please consult a
            licensed physician or visit an authorized pharmacy.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            User Responsibility
          </h2>
          <p className="text-gray-600 mb-6">You are solely responsible for:</p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Verifying product suitability for your use</li>
            <li>
              Reading all product labels, warnings, and usage instructions
            </li>
            <li>Following recommended dosages</li>
            <li>Understanding potential side effects and interactions</li>
            <li>Seeking medical advice if any adverse reactions occur</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Limitation of Liability
          </h2>
          <p className="text-gray-600 mb-6">
            Zenvira is <strong>NOT responsible</strong> for:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>Misuse or improper use of products</li>
            <li>Adverse reactions or health complications</li>
            <li>Lack of expected results from product use</li>
            <li>Interactions with other medications or supplements</li>
            <li>Allergic reactions to product ingredients</li>
            <li>Any direct, indirect, or consequential damages</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">Age Restrictions</h2>
          <p className="text-gray-600 mb-6">
            Some products may be restricted to certain age groups. Please verify
            age appropriateness with a healthcare professional before purchase.
          </p>

          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Emergency Medical Situations
          </h2>
          <p className="text-gray-600 mb-6">
            If you experience a medical emergency, please:
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
            <li>
              <strong>Call emergency services immediately</strong> (dial 999 or
              your local emergency number)
            </li>
            <li>Do NOT rely on Zenvira or this website for emergency care</li>
            <li>Seek immediate professional medical attention</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-8 mb-4">No Diagnosis</h2>
          <p className="text-gray-600 mb-6">
            The information on this website does not diagnose, treat, cure, or
            prevent any disease. If you suspect you have a medical condition,
            consult a qualified healthcare provider.
          </p>

          <div className="bg-red-50 border-l-4 border-red-500 p-6 mt-8">
            <p className="text-sm text-gray-600">
              <strong>Last Updated:</strong> February 2, 2026
            </p>
            <p className="text-sm text-gray-600 mt-4">
              <strong>For medical emergencies:</strong> Call 999 or your local
              emergency number immediately.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              For product safety concerns, contact us at{" "}
              <a
                href="mailto:safety@zenvira.com"
                className="text-red-600 hover:underline"
              >
                safety@zenvira.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
