import Image from "next/image";
import { FiCheck, FiPhoneCall } from "react-icons/fi";

const AboutBanner = () => {
  return (
    <section className="py-10 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-center">
          {/* LEFT IMAGE CARD */}
          <div className="relative">
            {/* Green Accent Layer */}
            {/* <div className="absolute -left-4 top-4 w-full h-full bg-primary rounded-xl" /> */}

            {/* Main Card */}
            <div className="relative bg-gray-100 rounded-lg sm:rounded-xl overflow-hidden">
              <div className="w-full relative">
                <Image
                  src="https://i.ibb.co.com/67Ls0cSj/photo-1523050854058-8df90110c9f1.jpg"
                  alt="Medical Partner"
                  width={600}
                  height={400}
                  className="object-cover w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="mt-8 lg:mt-0">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
              Your faithful partners <br />
              Medical Goods
            </h2>

            <p className="text-sm sm:text-base text-gray-600 max-w-md mb-6 sm:mb-8 leading-relaxed">
              No matter how much you know about a particular medical field
              health care professional, you always need to be thinking about
              what’s next.
            </p>

            {/* FEATURES */}
            <div className="space-y-4 mb-8">
              <Feature text="Better security for patient privacy and information." />
              <Feature text="More products at lower prices." />
              <Feature text="Connect customers with the power of eCommerce at all." />
            </div>

            {/* FOOTER ROW */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center  gap-6 mt-8 sm:mt-10">
              {/* PROFILE */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shrink-0">
                  <Image
                    src="https://i.ibb.co.com/PzV9bqx1/blob.webp"
                    alt="Ab Nahid"
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-bold text-gray-900">
                    Ab Nahid
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Medical Specialist
                  </p>
                </div>
              </div>

              {/* SUPPORT PILL */}
              <div className="flex items-center gap-3 sm:gap-4 bg-primary/10 px-4 sm:px-6 py-3 sm:py-4 rounded-full text-primary">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-primary flex items-center justify-center shrink-0">
                  <FiPhoneCall size={20} />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-medium opacity-90 ">
                    Get Support
                  </p>
                  <p className="text-sm sm:text-base font-bold ">
                    (028) 122 4513
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutBanner;
/* FEATURE ITEM */
function Feature({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-white">
        <FiCheck size={14} />
      </div>
      <p className="text-sm text-gray-800">{text}</p>
    </div>
  );
}
