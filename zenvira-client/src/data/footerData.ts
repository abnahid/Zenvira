import {
  FaCcAmex,
  FaCcMastercard,
  FaCcPaypal,
  FaCcStripe,
  FaCcVisa,
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTwitter,
} from "react-icons/fa";

export const footerData = {
  brand: {
    name: "Zenvira",
    tagline:
      "We are a dedicated team of pharmaceutical experts and healthcare professionals committed to providing high-quality medicines and health solutions worldwide.",
    address: "500 Medical Park Drive, sylhet",
  },

  about: {
    title: "About Us",
    description:
      "Zenvira has been a trusted partner in healthcare for over a decade, delivering reliable, safe, and clinically-proven pharmaceutical products to patients and healthcare providers across major cities worldwide.",
  },

  links: {
    title: "Useful Links",
    items: [
      { label: "About Us", href: "/about" },
      { label: "Shops", href: "/shops" },
      { label: "Our Doctors", href: "/doctors" },
      { label: "Health Resources", href: "/resources" },
      { label: "Contact Us", href: "/contact" },
      { label: "Become a Seller", href: "/become-seller" },
    ],
  },

  help: {
    title: "Help?",
    items: [
      { label: "FAQ", href: "/faq" },
      { label: "Dosage Guide", href: "/dosage" },
      { label: "Side Effects", href: "/side-effects" },
      { label: "Product Information", href: "/product-info" },
      { label: "Safety Policy", href: "/safety" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },

  legal: {
    title: "Legal",
    items: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Medical Disclaimer", href: "/disclaimer" },
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Refund & Returns", href: "/refund" },
      { label: "Tax Information", href: "/tax" },
    ],
  },

  socials: [
    { icon: FaFacebookF, href: "#" },
    { icon: FaTwitter, href: "#" },
    { icon: FaInstagram, href: "#" },
    { icon: FaPinterestP, href: "#" },
  ],

  payments: [FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcStripe, FaCcAmex],

  copyright: "© Zenvira Pharmaceuticals. All rights reserved.",
};
