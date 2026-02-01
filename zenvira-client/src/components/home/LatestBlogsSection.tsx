"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaArrowRight, FaCalendarAlt } from "react-icons/fa";

interface Blog {
  id: string;
  slug: string;
  tag: string;
  title: string;
  description: string;
  author: string;
  authorImage: string;
  date: string;
  image: string;
}

// Easily editable blogs data
const blogsData: Blog[] = [
  {
    id: "1",
    slug: "healthy-nourishing-food-covid",
    tag: "COVID-19",
    title: "Pure is the most healthy and most nourishing food",
    description:
      "More off this less hello salamander lied much over tightly circa horse taped mightily",
    author: "Mehedii.H",
    authorImage: "https://i.ibb.co.com/PzV9bqx1/blob.webp",
    date: "July 27, 2020",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "2",
    slug: "medical-safety-tips",
    tag: "MEDICAL",
    title: "Medical safety tips for a healthier lifestyle today",
    description:
      "More off this less hello salamander lied much over tightly circa horse taped mightily",
    author: "Mehedii.H",
    authorImage: "https://i.ibb.co.com/PzV9bqx1/blob.webp",
    date: "July 28, 2020",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "3",
    slug: "protection-guidelines",
    tag: "PROTECTION",
    title: "Essential protection guidelines for viral safety",
    description:
      "More off this less hello salamander lied much over tightly circa horse taped mightily",
    author: "Mehedii.H",
    authorImage: "https://i.ibb.co.com/PzV9bqx1/blob.webp",
    date: "July 29, 2020",
    image:
      "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=800",
  },
];

export default function LatestBlogsSection() {
  const router = useRouter();

  const handleCardClick = (slug: string) => {
    router.push(`/blog/${slug}`);
  };

  return (
    <section className="py-10 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Latest Blogs</h2>
          <p className="text-gray-500 text-xs sm:text-sm px-4">
            Stay updated with the latest health tips, medical advice, and safety
            guidelines.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {blogsData.map((blog) => (
            <div
              key={blog.id}
              onClick={() => handleCardClick(blog.slug)}
              className="group cursor-pointer border border-gray-200 rounded-xl overflow-hidden bg-white hover:shadow-lg transition"
            >
              {/* IMAGE WITH TAG */}
              <div className="h-48 sm:h-56 md:h-52 lg:h-56 bg-gray-200 relative overflow-hidden">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* TAG BADGE - Bottom Left of Image */}
                <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 bg-primary text-white text-xs font-medium px-3 sm:px-4 py-1 sm:py-1.5 rounded-full">
                  {blog.tag}
                </span>
              </div>

              {/* CONTENT */}
              <div className="p-4 sm:p-6">
                {/* AUTHOR & DATE ROW */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  {/* Author Avatar */}
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-300 overflow-hidden relative shrink-0">
                    <Image
                      src={blog.authorImage}
                      alt={blog.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <span className="text-xs sm:text-sm text-gray-700 font-medium">
                    {blog.author}
                  </span>
                  <div className="flex items-center gap-1 sm:gap-1.5 text-gray-400">
                    <FaCalendarAlt size={10} className="sm:w-3 sm:h-3" />
                    <span className="text-xs sm:text-sm">{blog.date}</span>
                  </div>
                </div>

                {/* TITLE */}
                <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 mb-2 sm:mb-3 line-clamp-2 group-hover:text-primary transition">
                  {blog.title}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                  {blog.description}
                </p>

                {/* READ MORE */}
                <div className="flex items-center gap-2 text-gray-800 font-medium group-hover:text-primary transition text-sm">
                  <span>Read More</span>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-current flex items-center justify-center">
                    <FaArrowRight size={8} className="sm:w-2.5 sm:h-2.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
