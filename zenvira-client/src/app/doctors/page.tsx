import PageBanner from "@/components/PageBanner";
import Image from "next/image";
import { FiFacebook, FiInstagram, FiLinkedin, FiTwitter } from "react-icons/fi";

export const metadata = {
  title: "Our Doctors | Zenvira",
  description: "Meet our team of expert doctors and medical professionals",
};

const doctors = [
  {
    name: "Dr. Sarah Mitchell",
    role: "Chief Medical Officer",
    specialization: "General Medicine",
    image: "https://i.ibb.co.com/39QLHv5H/1693926367335.jpg",
    bio: "15+ years of experience in pharmaceutical consulting and patient care.",
  },
  {
    name: "Dr. Ahmed Hassan",
    role: "Pharmacist",
    specialization: "Pharmacy",
    image: "https://i.ibb.co.com/rK6v6Xr5/1739435784259.jpg",
    bio: "Expert in medication management and drug interactions.",
  },
  {
    name: "Dr. Priya Sharma",
    role: "Clinical Advisor",
    specialization: "Pharmacology",
    image:
      "https://i.ibb.co.com/Zz7HrXgJ/1750602389688-e-1756944000-v-beta-t-rsy-A7-Ftr-NJaz-CX1-VS9lkuh12-Hon-WNhh-Kes1n4wd6k-SA.jpg",
    bio: "Specialized in clinical research and OTC medication guidance.",
  },
  {
    name: "Dr. James Wilson",
    role: "Regulatory Specialist",
    specialization: "Healthcare Compliance",
    image: "https://i.ibb.co.com/PzV9bqx1/blob.webp",
    bio: "Ensures all products meet regulatory and safety standards.",
  },
];

function SocialIcon({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
        active
          ? "bg-emerald-500 text-white"
          : "bg-gray-200 text-gray-700 hover:bg-emerald-500 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

export default function DoctorsPage() {
  return (
    <>
      <PageBanner
        title="Our Doctors"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About" },
          { label: "Our Doctors" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Introduction */}
        <div className="mb-16">
          <h1 className="text-3xl font-bold mb-4">Meet Our Expert Team</h1>
          <p className="text-gray-600 text-lg mb-6">
            Our team of experienced doctors and medical professionals is
            dedicated to providing the best pharmaceutical guidance and
            healthcare solutions. Each team member brings years of expertise in
            their respective fields.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {doctors.map((doctor, index) => (
            <div key={index} className="text-center">
              {/* Card */}
              <div className="group relative w-full rounded-lg overflow-hidden bg-gray-300 cursor-pointer mb-4">
                {/* Image */}
                <div className="relative w-full h-72">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  {/* Social Icons */}
                  <div className="flex gap-3 scale-90 group-hover:scale-100 transition duration-300">
                    <SocialIcon>
                      <FiTwitter size={16} />
                    </SocialIcon>
                    <SocialIcon active>
                      <FiFacebook size={16} />
                    </SocialIcon>
                    <SocialIcon>
                      <FiInstagram size={16} />
                    </SocialIcon>
                    <SocialIcon>
                      <FiLinkedin size={16} />
                    </SocialIcon>
                  </div>
                </div>
              </div>

              {/* Info */}
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {doctor.name}
              </h3>
              <p className="text-emerald-600 text-sm font-medium mb-2">
                {doctor.role}
              </p>
              <p className="text-gray-500 text-xs mb-3">
                {doctor.specialization}
              </p>
              <p className="text-gray-600 text-sm">{doctor.bio}</p>
            </div>
          ))}
        </div>

        {/* Qualifications Section */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Our Qualifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Medical Expertise</h3>
              <ul className="text-gray-600 space-y-2">
                <li>✓ Licensed Medical Doctors</li>
                <li>✓ Board-Certified Pharmacists</li>
                <li>✓ Clinical Research Experience</li>
                <li>✓ 10+ Years Average Experience</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Certifications</h3>
              <ul className="text-gray-600 space-y-2">
                <li>✓ Healthcare Regulatory Compliance</li>
                <li>✓ OTC Medication Guidelines</li>
                <li>✓ Patient Safety Protocols</li>
                <li>✓ International Medical Standards</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Have Health Questions?</h2>
          <p className="text-gray-600 mb-6">
            Our doctors are here to provide guidance on medication and health
            concerns.
          </p>
          <a
            href="/contact"
            className="inline-block bg-emerald-500 text-white px-8 py-3 rounded-lg hover:bg-emerald-600 transition"
          >
            Contact Our Team
          </a>
        </div>
      </div>
    </>
  );
}
