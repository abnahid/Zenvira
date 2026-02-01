"use client";

import Image from "next/image";

interface Feature {
  image: string;
  imageAlt: string;
  title: string;
  description: string;
}

// Easily editable features data
const featuresData: Feature[] = [
  {
    image: "/assets/truck.svg",
    imageAlt: "Free shipping",
    title: "Free Shipping",
    description: "Free shipping world wide",
  },
  {
    image: "/assets/return-box.svg",
    imageAlt: "Easy returns",
    title: "Easy Returns",
    description: "Free shipping world wide",
  },
  {
    image: "/assets/credit-card.svg",
    imageAlt: "Secure payment",
    title: "Secure Payment",
    description: "Free shipping world wide",
  },
  {
    image: "/assets/phone-call.svg",
    imageAlt: "24/7 support",
    title: "24/7 Support",
    description: "Free shipping world wide",
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuresData.map((feature, index) => {
            return (
              <div key={index} className="flex items-center gap-4">
                <div className="h-12 w-12 flex items-center justify-center bg-white rounded-md p-2">
                  <div className="h-8 w-8 flex items-center justify-center">
                    <Image
                      src={feature.image}
                      alt={feature.imageAlt}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
