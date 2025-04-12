"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";import { BookOpen, Users, ShieldCheck } from "lucide-react";

const services = [
  {
    title: "Study Materials",
    desc: "Access curated resources tailored to your course and level with ease.",
    icon: <BookOpen className="w-10 h-10" />,
  },
  {
    title: "Study Groups",
    desc: "Find and join active WhatsApp study groups within your university.",
    icon: <Users className="w-10 h-10" />,
  },
  {
    title: "Verified Content",
    desc: "We ensure all study materials and groups are credible and up to date.",
    icon: <ShieldCheck className="w-10 h-10" />,
  },
];

export default function Services() {
  return (
    <section className=" pt-20  px-4 md:px-12c">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl fst md:text-4xl font-bold text-[#003666]">Our Services</h2>
        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          Discover the tools and support we provide to help Nigerian university students thrive.
        </p>

        <div className="mt-12 grid gap-10 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div key={index} className="relative group">
              {/* Gradient Accent Border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#75bfff] to-[#003666] p-[1px] blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300" />

              {/* Card */}
              <div className="relative bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.02] text-center transition-all duration-300">
                {/* Top Tab Accent */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-14 h-1.5 bg-[#75bfff] rounded-b-md shadow-md" />

                {/* Icon with slow bounce */}
                <div className="flex justify-center items-center mb-5 text-[#003666] animate-bounce-slow">
                  {service.icon}
                </div>

                <h3 className="text-xl font-bold text-[#003666] mb-3 fst">{service.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed max-w-xs mx-auto">
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
