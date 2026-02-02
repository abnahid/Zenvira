import Image from "next/image";
import { FiFacebook, FiInstagram, FiLinkedin, FiTwitter } from "react-icons/fi";

const team = [
  {
    name: "Abdul Jabbar Al Nahid",
    role: "Founder — Ab Nahid Agency",
    image: "https://i.ibb.co.com/PzV9bqx1/blob.webp",
  },
  {
    name: "Cat",
    role: "Frontend Engineer",
    image: "https://i.ibb.co.com/rK6v6Xr5/1739435784259.jpg",
  },
  {
    name: "Mehedi Mohammad",
    role: "Medical Consultant",
    image: "https://i.ibb.co.com/39QLHv5H/1693926367335.jpg",
  },
  {
    name: "Shakila Akter",
    role: "Support Specialist",
    image:
      "https://i.ibb.co.com/Zz7HrXgJ/1750602389688-e-1756944000-v-beta-t-rsy-A7-Ftr-NJaz-CX1-VS9lkuh12-Hon-WNhh-Kes1n4wd6k-SA.jpg",
  },
];

export default function ExpertTeam() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8 lg:mb-10">
          Our Expert Team
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              {/* Card */}
              <div className="group relative w-full  rounded-lg sm:rounded-xl overflow-hidden bg-gray-300 cursor-pointer">
                {/* Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={400}
                    className="object-cover"
                  />
                </div>

                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  {/* Social Icons */}
                  <div className="flex gap-3 sm:gap-4 scale-90 group-hover:scale-100 transition duration-300">
                    <SocialIcon>
                      <FiTwitter />
                    </SocialIcon>
                    <SocialIcon active>
                      <FiFacebook />
                    </SocialIcon>
                    <SocialIcon>
                      <FiInstagram />
                    </SocialIcon>
                    <SocialIcon>
                      <FiLinkedin />
                    </SocialIcon>
                  </div>
                </div>
              </div>

              {/* Name */}
              <h3 className="mt-3 sm:mt-4 font-semibold text-sm sm:text-base text-gray-900">
                {member.name}
              </h3>

              {/* Role */}
              <p className="text-xs sm:text-sm text-primary mt-1">
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* SOCIAL ICON BUTTON */
function SocialIcon({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white transition
      ${active ? "bg-primary" : "bg-white/20 hover:bg-primary"}`}
    >
      {children}
    </div>
  );
}
