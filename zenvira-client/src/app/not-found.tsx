import PageBanner from "@/components/PageBanner";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Banner */}
      <PageBanner
        title="Error Page"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Error Page" }]}
      />

      {/* 404 Content */}
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="flex flex-col items-center justify-center gap-8">
          {/* 404 Image */}
          <div className="relative w-full max-w-md h-64 flex items-center justify-center">
            <Image
              src="/assets/404.png"
              alt="404 Not Found"
              width={500}
              height={300}
              className="object-contain"
              priority
            />
          </div>

          {/* Error Message */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              oops! The page you requested was not found!
            </h2>
            <p className="text-gray-600 text-sm sm:text-base mb-8">
              Sorry, but the page you are looking for does not exist!
            </p>

            {/* Back to Home Button */}
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition"
            >
              Back To Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
