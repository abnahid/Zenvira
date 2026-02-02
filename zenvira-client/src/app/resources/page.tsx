import PageBanner from "@/components/PageBanner";
import Link from "next/link";

export const metadata = {
  title: "Health Resources | Zenvira",
  description: "Educational resources and health guides from Zenvira",
};

const resources = [
  {
    id: 1,
    title: "Understanding OTC Medications",
    category: "Education",
    description:
      "Learn about over-the-counter medications and how to use them safely.",
    image: "📚",
  },
  {
    id: 2,
    title: "Cold & Flu Prevention Guide",
    category: "Health Tips",
    description:
      "Complete guide to preventing and managing cold and flu symptoms.",
    image: "🤧",
  },
  {
    id: 3,
    title: "Pain Management Options",
    category: "Treatment",
    description:
      "Explore safe and effective pain management options available.",
    image: "💊",
  },
  {
    id: 4,
    title: "Allergy Management",
    category: "Health Tips",
    description:
      "Everything you need to know about managing allergies naturally.",
    image: "🌿",
  },
  {
    id: 5,
    title: "Digestive Health Guide",
    category: "Wellness",
    description: "Tips and remedies for maintaining optimal digestive health.",
    image: "🍎",
  },
  {
    id: 6,
    title: "Sleep & Rest Guide",
    category: "Wellness",
    description: "Comprehensive guide to improving sleep quality and rest.",
    image: "😴",
  },
  {
    id: 7,
    title: "Vitamin & Supplement Guide",
    category: "Nutrition",
    description: "Understanding vitamins and supplements for your health.",
    image: "💉",
  },
  {
    id: 8,
    title: "Drug Interaction Checker",
    category: "Tools",
    description: "Learn about potential interactions between medications.",
    image: "⚠️",
  },
];

export default function ResourcesPage() {
  const categories = [
    "All",
    "Education",
    "Health Tips",
    "Treatment",
    "Wellness",
    "Nutrition",
    "Tools",
  ];

  return (
    <>
      <PageBanner
        title="Health Resources"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]}
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Introduction */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">Learn & Stay Healthy</h1>
          <p className="text-gray-600 text-lg">
            Zenvira provides comprehensive health resources and educational
            materials to help you make informed decisions about your health and
            medication.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  index === 0
                    ? "bg-emerald-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-emerald-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {/* Icon/Image */}
              <div className="w-full h-48 bg-linear-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-6xl">
                {resource.image}
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-xs text-emerald-600 font-semibold uppercase mb-2">
                  {resource.category}
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {resource.description}
                </p>
                <Link
                  href="#"
                  className="inline-block text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-3">📖 Knowledge Base</h3>
              <p className="text-gray-600 mb-4">
                Access our comprehensive knowledge base with articles on
                medication, health tips, and wellness.
              </p>
              <Link
                href="#"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Browse Knowledge Base →
              </Link>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">
                📞 Expert Consultation
              </h3>
              <p className="text-gray-600 mb-4">
                Connect with our medical professionals for personalized health
                advice and guidance.
              </p>
              <Link
                href="/contact"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Schedule Consultation →
              </Link>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">🎥 Video Tutorials</h3>
              <p className="text-gray-600 mb-4">
                Watch educational videos on proper medication usage and health
                practices.
              </p>
              <Link
                href="#"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Watch Videos →
              </Link>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-3">📱 Mobile App</h3>
              <p className="text-gray-600 mb-4">
                Download our mobile app for easy access to health resources and
                medication reminders.
              </p>
              <Link
                href="#"
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Download App →
              </Link>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-2xl font-bold mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "How do I know which OTC medicine to use?",
                a: "Consult with our doctors or pharmacists. We provide personalized recommendations based on your symptoms and medical history.",
              },
              {
                q: "Are all resources free to access?",
                a: "Yes, all educational resources on Zenvira are free for our customers.",
              },
              {
                q: "Can I download resources for offline use?",
                a: "Many resources are available for download. Check individual resource pages for download options.",
              },
              {
                q: "How often are resources updated?",
                a: "We update our resources regularly to reflect the latest medical information and guidelines.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
