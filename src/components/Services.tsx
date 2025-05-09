"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, Users, ShieldCheck } from "lucide-react";

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
    <section className="px-4 md:px-12c pt-20">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="font-bold text-[#003666] text-3xl md:text-4xl fst">
          Our Services
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-gray-600">
          Discover the tools and support we provide to help Nigerian university
          students thrive.
        </p>

        <div className="gap-10 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative cursor-pointer"
            >
              {/* Gradient Accent Border */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#75bfff] to-[#003666] opacity-0 group-hover:opacity-100 blur-md p-[2px] rounded-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_32px_0_rgba(0,54,102,0.25)]" />

              {/* Card */}
              <div className="relative bg-white/80 shadow-xl group-hover:shadow-2xl group-hover:shadow-[#75bfff]/40 backdrop-blur-md p-6 rounded-2xl text-center transition-all duration-300 transform group-hover:scale-105 group-hover:-translate-y-2 border border-transparent group-hover:border-[#75bfff]">
                {/* Top Tab Accent */}
                <div className="-top-2 left-1/2 absolute bg-[#75bfff] shadow-md rounded-b-md w-14 h-1.5 -translate-x-1/2 transform" />

                {/* Icon with animated effect */}
                <div className="flex justify-center items-center mb-5 text-[#003666] transition-all duration-300 group-hover:text-[#75bfff] group-hover:animate-wiggle">
                  {service.icon}
                </div>

                <h3 className="mb-3 font-bold text-[#003666] text-xl fst">
                  {service.title}
                </h3>
                <p className="mx-auto max-w-xs text-gray-700 text-sm leading-relaxed">
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
