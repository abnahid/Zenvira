import PageBanner from "@/components/PageBanner";
import ContactClient from "@/components/contact/ContactClient";

const ContactPage = () => {
  return (
    <div>
      <PageBanner
        title="Contact Us"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
      />
      <ContactClient />
    </div>
  );
};

export default ContactPage;
