"use client";

import { useState } from "react";
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaUser } from "react-icons/fa";
import { MdEmail, MdPhone } from "react-icons/md";

const contactInfoData = [
  {
    icon: <FaPhone />,
    title: "Phone Number",
    detail: "Head office: (028) 122 4513",
  },
  {
    icon: <FaEnvelope />,
    title: "Mail Address",
    detail: "webexample123@gmail.com",
  },
  {
    icon: <FaMapMarkerAlt />,
    title: "Office Address",
    detail: "254 Lillian Blvd, Holbrook",
  },
];

export default function ContactClient() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    product: "",
    message: "",
  });

  const [open, setOpen] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* LEFT — CONTACT INFO */}
            <div className="p-10">
              <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                Feel free to contact <br /> us for any query.
              </h2>

              <div className="mt-10 space-y-4">
                {contactInfoData.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 bg-primary rounded-full px-5 py-3"
                  >
                    <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white text-lg">
                      {info.icon}
                    </div>

                    <div>
                      <h3 className="font-semibold text-white text-sm">
                        {info.title}
                      </h3>
                      <p className="text-white/80 text-xs">{info.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — FORM */}
            <div className="p-10 bg-gray-50">
              <form className="space-y-5">
                {/* NAME */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    name="firstName"
                    placeholder="First Name*"
                    icon={<FaUser />}
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <Field
                    name="lastName"
                    placeholder="Last Name*"
                    icon={<FaUser />}
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>

                {/* EMAIL + PHONE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    name="email"
                    type="email"
                    placeholder="Mail Address*"
                    icon={<MdEmail />}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <Field
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    icon={<MdPhone />}
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                {/* CUSTOM SELECT */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOpen(!open)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 flex justify-between items-center text-gray-600 hover:border-primary transition"
                  >
                    {formData.product || "Choose Product"}
                    <span className="text-sm">▾</span>
                  </button>

                  {open && (
                    <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg mt-2 shadow-lg overflow-hidden">
                      {[
                        "Medicines",
                        "Healthcare Products",
                        "Medical Equipment",
                        "Supplements",
                        "Other",
                      ].map((item) => (
                        <div
                          key={item}
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              product: item,
                            }));
                            setOpen(false);
                          }}
                          className="px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 cursor-pointer"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* MESSAGE */}
                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Enter Message"
                    rows={5}
                    className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="bg-primary text-white px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition flex items-center gap-2"
                >
                  Submit Request →
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* INPUT FIELD COMPONENT */
function Field({
  name,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
}: {
  name: string;
  type?: string;
  placeholder: string;
  icon: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative">
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={placeholder.includes("*")}
        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:border-primary"
      />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
        {icon}
      </span>
    </div>
  );
}
