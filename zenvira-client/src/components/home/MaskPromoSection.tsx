"use client";

import Link from "next/link";

// Easily editable feature list
const features = [
  "Activated Carbon",
  "Breathing Valve",
  "6 Layer Filtration",
  "Rewash & Reusable",
];

function FeatureItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs">
        ✓
      </div>
      <span className="text-xs sm:text-sm text-gray-800">{text}</span>
    </div>
  );
}

export default function MaskPromoSection() {
  return (
    <section className="bg-gray-50 py-10 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* LEFT SHAPE / IMAGE - Hidden on mobile, shown on lg */}
        <div className="relative flex justify-center order-2 lg:order-1">
          <svg
            viewBox="0 0 629 553"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-64 h-56 sm:w-80 sm:h-72 md:w-96 md:h-80 lg:w-132.25 lg:h-113.25"
          >
            <path
              d="M99.6697 545.422C206.504 599.413 207.798 340.26 482.688 346.073C757.578 351.886 578.342 79.9146 471.508 25.9232C364.674 -28.0683 148.315 0.232768 55.3506 130.11C-37.6134 259.988 -7.1646 491.431 99.6697 545.422Z"
              fill="#0A9A73"
              fillOpacity="0.14"
            />
          </svg>
        </div>

        {/* RIGHT CONTENT - Shown first on mobile */}
        <div className="order-1 lg:order-2">
          <span className="text-xs text-primary font-semibold uppercase tracking-wide">
            N95 Facial Covering Mask
          </span>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-2 mb-4">
            Grade A Safety Masks <br className="hidden sm:block" />
            For Sale. Hurry Up!
          </h2>

          <p className="text-gray-600 max-w-md mb-6 text-sm sm:text-base">
            Purus velit class id cense cteur ante elit vestibulum dignissim
            volutpat vestibulum vulputate. Suspendisse eu.
          </p>

          {/* FEATURE LIST */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
            {features.map((feature, index) => (
              <FeatureItem key={index} text={feature} />
            ))}
          </div>

          <Link
            href="/shops"
            className="text-primary font-medium hover:underline inline-flex items-center gap-1 text-sm sm:text-base"
          >
            VIEW PRODUCTS <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
