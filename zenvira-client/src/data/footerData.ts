import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaPinterestP,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcStripe,
  FaCcAmex,
} from "react-icons/fa"

export const footerData = {
  brand: {
    name: "Vicodin",
    tagline:
      "We are a team of designers and developers creating high quality Magento, Prestashop, and custom web solutions.",
    address: "254 Lillian Blvd, Holbrook",
  },

  about: {
    title: "About Us",
    description:
      "Corporate clients and leisure travelers have relied on our dependable, safe, and professional services across major cities worldwide for more than a decade.",
  },

  links: {
    title: "Useful Links",
    items: [
      { label: "About", href: "/about" },
      { label: "News", href: "/news" },
      { label: "Partners", href: "/partners" },
      { label: "Room Details", href: "/rooms" },
      { label: "Gallery", href: "/gallery" },
      { label: "Contacts", href: "/contact" },
    ],
  },

  help: {
    title: "Help?",
    items: [
      { label: "FAQ", href: "/faq" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Reporting", href: "/report" },
      { label: "Documentation", href: "/docs" },
      { label: "Support Policy", href: "/support" },
      { label: "Privacy", href: "/privacy" },
    ],
  },

  socials: [
    { icon: FaFacebookF, href: "#" },
    { icon: FaTwitter, href: "#" },
    { icon: FaInstagram, href: "#" },
    { icon: FaPinterestP, href: "#" },
  ],

  payments: [FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcStripe, FaCcAmex],

  copyright: "© TunaThemes All rights reserved.",
}
