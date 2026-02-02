import { FiBox, FiDollarSign, FiHeadphones, FiTruck } from "react-icons/fi";

const features = [
  {
    title: "Free Delivery",
    desc: "Fast and reliable shipping to your doorstep with no hidden charges.",
    icon: <FiTruck />,
  },
  {
    title: "100% Cash Back",
    desc: "We guarantee your satisfaction with our hassle-free cash back policy.",
    icon: <FiDollarSign />,
    active: true,
  },
  {
    title: "Quality Product",
    desc: "All our products are carefully selected and verified for quality.",
    icon: <FiBox />,
  },
  {
    title: "24/7 Support",
    desc: "Our dedicated support team is always ready to help you anytime.",
    icon: <FiHeadphones />,
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8 sm:mb-12 lg:mb-16">
          Why Choose Us
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className={`relative text-center p-6 sm:p-8 rounded-lg sm:rounded-xl transition-all duration-300
              ${
                item.active
                  ? "bg-white shadow-lg sm:shadow-xl"
                  : "bg-white hover:bg-white hover:shadow-lg"
              }`}
            >
              {/* Icon */}
              <div
                className={`mx-auto mb-4 w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center rounded-full text-lg sm:text-xl transition-colors
                ${
                  item.active
                    ? "bg-primary/10 text-primary"
                    : "bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary"
                }`}
              >
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3 text-gray-900">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {item.desc}
              </p>

              {/* Bottom Line (active only) */}
              {item.active && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
