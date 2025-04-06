import React from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";

const ContactBox = ({
  icon: Icon,
  title,
  value,
  link,
  linkText,
}: {
  icon: React.ElementType;
  title: string;
  value: string;
  link: string;
  linkText: string;
}) => {
  return (
    <div className="flex flex-col items-center p-6 border border-gray-200 rounded-lg transition-all hover:shadow-md bg-white">
      <Icon className="w-8 h-8 text-gray-600 mb-3" />
      <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{value}</p>
      <a
        href={link}
        className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
      >
        {linkText}
      </a>
    </div>
  );
};

const Contact = () => {
  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          Contact Us
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ContactBox
            icon={Mail}
            title="Email"
            value="info@example.com"
            link="mailto:info@example.com"
            linkText="Send an email"
          />
          <ContactBox
            icon={Phone}
            title="Phone"
            value="+1 (555) 123-4567"
            link="tel:+15551234567"
            linkText="Make a call"
          />
          <ContactBox
            icon={MessageCircle}
            title="WhatsApp"
            value="+1 (555) 987-6543"
            link="https://wa.me/15559876543"
            linkText="Chat on WhatsApp"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
