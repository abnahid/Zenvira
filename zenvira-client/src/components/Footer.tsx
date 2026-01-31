import { footerData } from "@/data/footerData";
import Image from "next/image";
import { FiMapPin } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* About */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            {footerData.about.title}
          </h3>
          <p className="text-sm leading-relaxed mb-6">
            {footerData.about.description}
          </p>

          <div className="flex gap-3">
            {footerData.socials.map((item, i) => {
              const Icon = item.icon;
              return (
                <a
                  key={i}
                  href={item.href}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-black hover:bg-emerald-500 hover:text-white transition"
                >
                  <Icon size={14} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            {footerData.links.title}
          </h3>
          <ul className="space-y-2 text-sm">
            {footerData.links.items.map((link, i) => (
              <li key={i}>
                <a
                  href={link.href}
                  className="hover:text-emerald-500 transition"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            {footerData.help.title}
          </h3>
          <ul className="space-y-2 text-sm">
            {footerData.help.items.map((link, i) => (
              <li key={i}>
                <a
                  href={link.href}
                  className="hover:text-emerald-500 transition"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Brand + Subscribe */}
        <div>
          {/* Logo */}
          <Image src="/logo-zenvira.svg" alt="Logo" width={180} height={36} />

          <p className="text-sm my-4">{footerData.brand.tagline}</p>

          <p className="text-sm flex items-center gap-2 mb-6">
            <FiMapPin className="w-4 h-4" />
            {footerData.brand.address}
          </p>

          <div className="flex">
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full px-4 py-2 bg-white text-black text-sm outline-none"
            />
            <button className="bg-emerald-500 px-4 py-2 text-black text-sm font-semibold hover:bg-emerald-600 transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">{footerData.copyright}</p>

          <div className="flex gap-4 text-gray-400">
            {footerData.payments.map((Icon, i) => (
              <Icon key={i} size={28} className="hover:text-white transition" />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
