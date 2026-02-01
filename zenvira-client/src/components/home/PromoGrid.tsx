import Image from "next/image";

export default function PromoGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* LEFT BIG CARD */}
        <div className="relative flex flex-col justify-between rounded-xl bg-primary/10 p-5 sm:p-8 min-h-64 sm:min-h-80 overflow-hidden hover:scale-[1.01] transition">
          {/* Tag */}
          <span className="inline-block w-fit bg-primary text-white text-xs px-3 py-1 rounded-full mb-4">
            In Store Now
          </span>

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Evion 400 <br /> mg
            </h2>
            <p className="text-sm text-gray-600 mb-4">Starting at $1.99</p>

            <button className="bg-primary text-white px-4 sm:px-5 py-2 rounded-md text-sm hover:bg-primary/90 transition">
              Shop Now →
            </button>
          </div>

          <div className="absolute right-2 sm:right-6 bottom-2 sm:bottom-6 rounded-lg flex items-center justify-center text-xs text-gray-500">
            <Image
              src="/assets/banner.png"
              alt="Evion 400"
              width={300}
              height={128}
              className="bg-transparent object-contain mix-blend-multiply w-32 sm:w-56 md:w-72 h-auto"
            />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-4 sm:gap-6">
          {/* TOP CARD */}
          <div className="relative flex flex-col justify-between rounded-xl bg-orange-50 p-5 sm:p-6 min-h-48 sm:min-h-0 hover:scale-[1.01] transition">
            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                First Aid Kits
                <br />
                Pre Package
              </h3>
              <p className="text-sm text-gray-600 mb-4">Starting at $16.99</p>

              <button className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary/90 transition">
                Shop Now →
              </button>
            </div>

            <div className="absolute right-2 sm:right-4 bottom-2 sm:bottom-4 rounded-md flex items-center justify-center text-[10px] text-gray-500">
              <Image
                src="/assets/banar1.jpg"
                alt="Evion 400"
                width={150}
                height={128}
                className="bg-transparent object-contain mix-blend-multiply w-20 sm:w-28 md:w-36 h-auto"
              />
            </div>
          </div>

          {/* BOTTOM CARD */}
          <div className="relative flex flex-col justify-between rounded-xl bg-green-50 p-5 sm:p-6 min-h-48 sm:min-h-0 hover:scale-[1.01] transition">
            {/* Badge */}
            <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
              Hot
            </span>

            <div className="relative z-10">
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                Hand Sanitizer
                <br />
                Package
              </h3>
              <p className="text-sm text-gray-600 mb-4">$199.00</p>

              <button className="bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-primary/90 transition">
                Shop Now →
              </button>
            </div>

            <div className="absolute right-2 sm:right-4 bottom-2 sm:bottom-4 rounded-md flex items-center justify-center text-[10px] text-gray-500">
              <Image
                src="/assets/banner2.webp"
                alt="Hand Sanitizer"
                width={180}
                height={128}
                className="bg-transparent object-contain mix-blend-multiply w-24 sm:w-32 md:w-44 h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
