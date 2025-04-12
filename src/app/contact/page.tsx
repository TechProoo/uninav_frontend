"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  Phone,
  Mail,
  Send,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  CheckCircle2,
} from "lucide-react";

// Component for team member card
const TeamMemberCard = ({
  name,
  role,
  image,
  github = "#",
  linkedin = "#",
  twitter = "#",
}) => (
  <motion.div
    className="flex flex-col items-center bg-white shadow-md p-6 rounded-xl text-center"
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="relative mb-4 w-28 h-28">
      <Image
        src={image}
        alt={name}
        fill
        className="border-4 border-blue-100 rounded-full object-cover"
      />
    </div>
    <h3 className="font-bold text-[#003666] text-lg">{name}</h3>
    <p className="mb-4 text-gray-600">{role}</p>
    <div className="flex gap-4 text-gray-500">
      <Link href={github} passHref target="_blank" rel="noopener noreferrer">
        <Github className="hover:text-[#003666] transition-colors" size={18} />
      </Link>
      <Link href={linkedin} passHref target="_blank" rel="noopener noreferrer">
        <Linkedin
          className="hover:text-[#003666] transition-colors"
          size={18}
        />
      </Link>
      <Link href={twitter} passHref target="_blank" rel="noopener noreferrer">
        <Twitter className="hover:text-[#003666] transition-colors" size={18} />
      </Link>
    </div>
  </motion.div>
);

const ContactPage = () => {
  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Animation setup
  useGSAP(() => {
    gsap.from(".contact-header", {
      opacity: 0,
      y: -50,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(".contact-form", {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 0.3,
      ease: "power3.out",
    });

    gsap.from(".contact-info", {
      opacity: 0,
      x: 50,
      duration: 1,
      delay: 0.5,
      ease: "power3.out",
    });

    gsap.from(".team-section", {
      opacity: 0,
      y: 50,
      duration: 1,
      delay: 0.7,
      ease: "power3.out",
    });
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message || !subject) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
        toast.success("Message sent successfully!");
      } else {
        throw new Error(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-blue-50 min-h-screen">
      <Toaster position="top-center" />

      {/* Header Section */}
      <section className="bg-gradient-to-r from-[#003666] to-[#001c33] px-4 md:px-8 lg:px-16 py-20 text-white">
        <div className="mx-auto max-w-7xl text-center contact-header">
          <h1 className="mb-4 font-bold text-4xl md:text-5xl">Get In Touch</h1>
          <p className="mx-auto max-w-2xl text-blue-100 text-lg md:text-xl">
            Have questions about UniNav? Want to collaborate with us? We'd love
            to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="bg-white px-4 md:px-8 lg:px-16 py-16">
        <div className="gap-12 lg:gap-20 grid md:grid-cols-2 mx-auto max-w-7xl">
          {/* Contact Form */}
          <div className="contact-form">
            <h2 className="mb-6 font-bold text-[#003666] text-3xl">
              Send Us a Message (It works 🌚)
            </h2>

            {isSuccess ? (
              <div className="bg-green-50 p-6 border border-green-200 rounded-lg text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle2 className="text-green-600" size={48} />
                </div>
                <h3 className="mb-2 font-semibold text-green-800 text-xl">
                  Message Sent!
                </h3>
                <p className="mb-4 text-green-700">
                  Thank you for reaching out. We'll get back to you shortly.
                </p>
                <button
                  onClick={() => setIsSuccess(false)}
                  className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-white"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                    placeholder="john.doe@example.com"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-colors"
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className="px-4 py-3 border border-gray-300 focus:border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 w-full transition-colors resize-none"
                    placeholder="Your message here..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex items-center justify-center gap-2 w-full py-3 px-6 text-white font-medium rounded-lg transition-colors ${
                    isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-[#003666] hover:bg-blue-800"
                  }`}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                  <Send size={18} />
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-8 contact-info">
            <h2 className="mb-8 font-bold text-[#003666] text-3xl">
              Contact Information
            </h2>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 mt-1 p-3 rounded-full text-blue-700">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-lg">Email Us</h3>
                <p className="mb-2 text-gray-600">
                  For general inquiries and support:
                </p>
                <a
                  href="mailto:uninav.buildminds@gmail.com"
                  className="text-blue-600 hover:underline"
                >
                  uninav.buildminds@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-100 mt-1 p-3 rounded-full text-green-700">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-lg">Call Us</h3>
                <p className="mb-2 text-gray-600">
                  Have an urgent question? Call us:
                </p>
                <a
                  href="https://wa.me/234123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  +234 123 456 789
                </a>
                <p className="mt-1 text-gray-500 text-sm">
                  (Redirects to WhatsApp)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-amber-100 mt-1 p-3 rounded-full text-amber-700">
                <MapPin size={24} />
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-lg">Our Base</h3>
                <p className="text-gray-600">
                  BuildMinds Development Team <br />
                  Lagos, Nigeria
                </p>
              </div>
            </div>

            <div className="bg-blue-50 mt-12 p-6 border border-blue-100 rounded-lg">
              <h3 className="mb-3 font-semibold text-[#003666] text-lg">
                Connect With Us
              </h3>
              <p className="mb-4 text-gray-600">
                Follow us on social media for updates, tips, and announcements.
              </p>
              <div className="flex gap-6">
                <a
                  href="https://twitter.com/uninav"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white shadow-sm p-3 rounded-full text-blue-400 hover:text-blue-600 transition-colors"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="https://github.com/buildminds/uninav"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white shadow-sm p-3 rounded-full text-gray-700 hover:text-black transition-colors"
                >
                  <Github size={20} />
                </a>
                <a
                  href="https://linkedin.com/company/buildminds"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white shadow-sm p-3 rounded-full text-blue-700 hover:text-blue-900 transition-colors"
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 team-section px-4 md:px-8 lg:px-16 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-4 font-bold text-[#003666] text-3xl md:text-4xl text-center">
            Meet the Team
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-gray-600 text-center">
            The talented BuildMinds team behind UniNav's development and vision
          </p>

          <div className="gap-8 grid md:grid-cols-2 lg:grid-cols-4">
            <TeamMemberCard
              name="Sarah Chen"
              role="Frontend Developer"
              image="https://randomuser.me/api/portraits/women/44.jpg"
              github="https://github.com/buildminds"
              linkedin="https://linkedin.com/in/buildminds"
              twitter="https://twitter.com/uninav"
            />

            <TeamMemberCard
              name="David Okonkwo"
              role="Backend Engineer"
              image="https://randomuser.me/api/portraits/men/75.jpg"
              github="https://github.com/buildminds"
              linkedin="https://linkedin.com/in/buildminds"
              twitter="https://twitter.com/uninav"
            />
            <TeamMemberCard
              name="Alex Johnson"
              role="Brand Manager"
              image="https://randomuser.me/api/portraits/men/32.jpg"
              github="https://github.com/buildminds"
              linkedin="https://linkedin.com/in/buildminds"
              twitter="https://twitter.com/uninav"
            />

            <TeamMemberCard
              name="Aisha Mohammed"
              role="Product Manager"
              image="https://randomuser.me/api/portraits/women/68.jpg"
              github="https://github.com/buildminds"
              linkedin="https://linkedin.com/in/buildminds"
              twitter="https://twitter.com/uninav"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white px-4 md:px-8 lg:px-16 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 font-bold text-[#003666] text-3xl text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-blue-50 p-6 border border-blue-100 rounded-lg">
              <h3 className="mb-2 font-semibold text-[#003666] text-lg">
                How can I contribute to UniNav?
              </h3>
              <p className="text-gray-600">
                You can contribute by uploading study materials, writing helpful
                blog posts, or even joining our team as a developer. Contact us
                for more information!
              </p>
            </div>

            <div className="bg-blue-50 p-6 border border-blue-100 rounded-lg">
              <h3 className="mb-2 font-semibold text-[#003666] text-lg">
                Is UniNav free to use?
              </h3>
              <p className="text-gray-600">
                Yes, UniNav is completely free for students to use! We offer
                optional promotional features for a fee, but all core
                functionalities are free.
              </p>
            </div>

            <div className="bg-blue-50 p-6 border border-blue-100 rounded-lg">
              <h3 className="mb-2 font-semibold text-[#003666] text-lg">
                How do I become a moderator?
              </h3>
              <p className="text-gray-600">
                To become a moderator, you need to have an active account with a
                verified university email. You can apply through your dashboard
                once you meet the requirements.
              </p>
            </div>

            <div className="bg-blue-50 p-6 border border-blue-100 rounded-lg">
              <h3 className="mb-2 font-semibold text-[#003666] text-lg">
                How can I report inappropriate content?
              </h3>
              <p className="text-gray-600">
                Each material and blog post has a "Report" button. You can use
                this to flag content that violates our community guidelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-[#003666] to-[#001c33] px-4 md:px-8 lg:px-16 py-16 text-white">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-bold text-3xl md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-blue-100 text-lg">
            Join thousands of students already using UniNav to enhance their
            academic journey and share knowledge.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/auth/signup"
              className="bg-white hover:bg-blue-50 px-8 py-3 rounded-lg font-medium text-[#003666] transition-colors"
            >
              Sign Up Now
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-transparent hover:bg-white/10 px-8 py-3 border border-white rounded-lg font-medium text-white transition-colors"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
