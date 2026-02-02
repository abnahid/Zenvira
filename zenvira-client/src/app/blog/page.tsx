import PageBanner from "@/components/PageBanner";
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Zenvira Blog | Health Articles & Tips",
  description: "Read the latest health articles, tips, and news from Zenvira",
};

const blogPosts = [
  {
    id: 1,
    title: "5 Natural Remedies for Cold & Flu Season",
    excerpt:
      "Discover effective natural remedies that can help boost your immunity and manage cold symptoms.",
    image: "https://i.ibb.co.com/PzV9bqx1/blob.webp",
    author: "Dr. Sarah Mitchell",
    date: "January 28, 2026",
    category: "Health Tips",
    readTime: "5 min read",
  },
  {
    id: 2,
    title: "Understanding Vitamin Deficiencies",
    excerpt:
      "Learn about common vitamin deficiencies, their symptoms, and how to address them naturally.",
    image: "https://i.ibb.co.com/rK6v6Xr5/1739435784259.jpg",
    author: "Dr. Priya Sharma",
    date: "January 25, 2026",
    category: "Nutrition",
    readTime: "7 min read",
  },
  {
    id: 3,
    title: "The Best OTC Pain Relievers Compared",
    excerpt:
      "Comparison of popular over-the-counter pain relief options and their effectiveness.",
    image: "https://i.ibb.co.com/39QLHv5H/1693926367335.jpg",
    author: "Dr. Ahmed Hassan",
    date: "January 22, 2026",
    category: "Medication Guide",
    readTime: "6 min read",
  },
  {
    id: 4,
    title: "Sleep Quality: Tips for Better Rest",
    excerpt:
      "Practical tips to improve your sleep quality and establish healthy sleep habits.",
    image:
      "https://i.ibb.co.com/Zz7HrXgJ/1750602389688-e-1756944000-v-beta-t-rsy-A7-Ftr-NJaz-CX1-VS9lkuh12-Hon-WNhh-Kes1n4wd6k-SA.jpg",
    author: "Dr. James Wilson",
    date: "January 20, 2026",
    category: "Wellness",
    readTime: "4 min read",
  },
  {
    id: 5,
    title: "Managing Allergies in Spring",
    excerpt:
      "Complete guide to managing seasonal allergies and finding relief during spring months.",
    image: "https://i.ibb.co.com/PzV9bqx1/blob.webp",
    author: "Dr. Sarah Mitchell",
    date: "January 18, 2026",
    category: "Health Tips",
    readTime: "5 min read",
  },
  {
    id: 6,
    title: "Digestive Health & Gut Bacteria",
    excerpt:
      "Everything you need to know about maintaining a healthy digestive system and gut flora.",
    image: "https://i.ibb.co.com/rK6v6Xr5/1739435784259.jpg",
    author: "Dr. Priya Sharma",
    date: "January 15, 2026",
    category: "Wellness",
    readTime: "8 min read",
  },
  {
    id: 7,
    title: "Drug Interactions You Should Know",
    excerpt:
      "Important information about potential drug interactions and how to use medications safely.",
    image: "https://i.ibb.co.com/39QLHv5H/1693926367335.jpg",
    author: "Dr. Ahmed Hassan",
    date: "January 12, 2026",
    category: "Medication Guide",
    readTime: "7 min read",
  },
  {
    id: 8,
    title: "Hydration: Why It Matters for Your Health",
    excerpt:
      "Discover the importance of proper hydration and recommended daily water intake.",
    image:
      "https://i.ibb.co.com/Zz7HrXgJ/1750602389688-e-1756944000-v-beta-t-rsy-A7-Ftr-NJaz-CX1-VS9lkuh12-Hon-WNhh-Kes1n4wd6k-SA.jpg",
    author: "Dr. James Wilson",
    date: "January 10, 2026",
    category: "Health Tips",
    readTime: "4 min read",
  },
];

export default function BlogPage() {
  const categories = [
    "All",
    "Health Tips",
    "Medication Guide",
    "Nutrition",
    "Wellness",
  ];

  return (
    <>
      <PageBanner
        title="Zenvira Blog"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Introduction */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold mb-4">Latest Health Articles</h1>
          <p className="text-gray-600 text-lg">
            Stay informed with our latest health articles, tips, and medical
            insights from our expert team.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <h2 className="text-lg font-semibold mb-4">Filter by Category</h2>
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

        {/* Featured Post */}
        <div className="mb-16 bg-white rounded-lg overflow-hidden shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative h-80 md:h-full">
              <Image
                src={blogPosts[0].image}
                alt={blogPosts[0].title}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col justify-center">
              <p className="text-emerald-600 font-semibold text-sm uppercase mb-2">
                Featured Article
              </p>
              <h2 className="text-3xl font-bold mb-3">{blogPosts[0].title}</h2>
              <p className="text-gray-600 mb-6">{blogPosts[0].excerpt}</p>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
                <span>{blogPosts[0].author}</span>
                <span>•</span>
                <span>{blogPosts[0].date}</span>
                <span>•</span>
                <span>{blogPosts[0].readTime}</span>
              </div>

              <Link
                href="#"
                className="inline-block bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition w-fit"
              >
                Read Article
              </Link>
            </div>
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogPosts.slice(1).map((post) => (
            <div
              key={post.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover hover:scale-105 transition duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-emerald-600 font-semibold text-xs uppercase mb-2">
                  {post.category}
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-emerald-600 cursor-pointer">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex gap-2">
                    <span>{post.author}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <span>{post.readTime}</span>
                </div>

                <Link
                  href="#"
                  className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-medium text-sm"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-3">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-gray-600 mb-6">
            Get the latest health articles and tips delivered to your inbox
            weekly.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button className="bg-emerald-500 text-white px-6 py-2 rounded-lg hover:bg-emerald-600 transition">
              Subscribe
            </button>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-12 flex justify-center gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            ← Previous
          </button>
          <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg">
            1
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            2
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            3
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            Next →
          </button>
        </div>
      </div>
    </>
  );
}
