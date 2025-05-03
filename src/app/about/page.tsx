"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// import AboutHeroImage from "@/app/";
import {
  BookOpen,
  GraduationCap,
  Users,
  Search,
  BookmarkIcon,
  PenTool,
  LucideBrain,
  Building,
  Layers,
  Check,
  Share2,
  MessageSquareText,
  Award,
  Sparkles, // Added for potential use
} from "lucide-react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const AboutPage = () => {
  // Animation for hero section
  useGSAP(() => {
    // Target elements within the hero section specifically
    gsap.from(".hero-content-item", {
      opacity: 0,
      y: 50, // Adjusted starting position
      duration: 0.8, // Slightly adjusted duration
      stagger: 0.15, // Adjusted stagger
      ease: "power3.out", // Smoother ease
    });

    // Animate features when they come into view
    gsap.utils.toArray<HTMLElement>(".feature-card").forEach((card, i) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        delay: i * 0.1,
      });
    });

    // Timeline animation for section headings
    gsap.utils.toArray<HTMLElement>(".section-heading").forEach((heading) => {
      gsap.from(heading, {
        scrollTrigger: {
          trigger: heading,
          start: "top 85%",
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
      });
    });
  }, []);

  return (
    <div className="bg-gradient-to-b from-slate-50 to-blue-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[url('/Image/about-hero.jpg')] bg-cover bg-center pt-28 md:pt-36 pb-24 md:pb-32 overflow-hidden text-white">
        {/* Overlay */}
        <div className="z-0 absolute inset-0 bg-gradient-to-t from-[#001c33]/80 via-[#003666]/70 to-transparent"></div>

        {/* Content Container */}
        <div className="z-10 relative mx-auto px-4 md:px-8 lg:px-16 max-w-7xl">
          <div className="flex lg:flex-row flex-col items-center gap-8 lg:gap-16">
            {/* Text Content */}
            <div className="space-y-6 lg:w-1/2 lg:text-left text-center">
              <h1 className="drop-shadow-md font-bold text-4xl md:text-5xl lg:text-6xl hero-content-item">
                Your Gateway to Academic Excellence
              </h1>
              <p className="drop-shadow-sm text-gray-200 text-lg md:text-xl hero-content-item">
                UniNav is a collaborative university study materials platform
                that organizes and simplifies resource discovery for students.
              </p>
              {/* Feature Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 md:gap-4 hero-content-item">
                <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-400 shadow-md px-4 py-2 rounded-full text-white hover:scale-105 transition-transform duration-300 transform">
                  <BookOpen size={18} />
                  <span className="font-medium text-sm">Study Materials</span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-400 shadow-md px-4 py-2 rounded-full text-white hover:scale-105 transition-transform duration-300 transform">
                  <GraduationCap size={18} />
                  <span className="font-medium text-sm">
                    Academic Resources
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-400 shadow-md px-4 py-2 rounded-full text-white hover:scale-105 transition-transform duration-300 transform">
                  <Users size={18} />
                  <span className="font-medium text-sm">Student Community</span>
                </div>
              </div>
            </div>
            {/* Laptop Image Container */}
            <div className="relative mt-8 lg:mt-0 lg:w-[55%] hero-content-item">
              {/* Animated Background Element */}
              <div className="-z-10 absolute inset-[-10%] bg-gradient-to-br from-cyan-400/30 via-blue-500/30 to-indigo-600/30 blur-3xl rounded-full animate-pulse duration-[4000ms]"></div>
              <Image
                src="/Image/dashboard-laptop.png"
                alt="UniNav Platform Dashboard on Laptop"
                width={700} // Increased width
                height={525} // Increased height proportionally
                className="drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white px-4 md:px-8 lg:px-16 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 font-bold text-3xl md:text-4xl text-center section-heading">
            Our <span className="text-blue-600">Mission</span>
          </h2>

          <div className="gap-8 grid md:grid-cols-3">
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 shadow-md p-6 rounded-xl feature-card">
              <div className="flex justify-center items-center bg-blue-100 mb-5 rounded-full w-14 h-14 text-blue-600">
                <Share2 size={28} />
              </div>
              <h3 className="mb-3 font-bold text-xl">Democratize Access</h3>
              <p className="text-gray-600">
                Making valuable academic resources accessible to all students
                regardless of their background.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-slate-50 shadow-md p-6 rounded-xl feature-card">
              <div className="flex justify-center items-center bg-green-100 mb-5 rounded-full w-14 h-14 text-green-600">
                <Users size={28} />
              </div>
              <h3 className="mb-3 font-bold text-xl">Build Community</h3>
              <p className="text-gray-600">
                Creating a collaborative environment where students help each
                other succeed academically.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-slate-50 shadow-md p-6 rounded-xl feature-card">
              <div className="flex justify-center items-center bg-amber-100 mb-5 rounded-full w-14 h-14 text-amber-600">
                <Award size={28} />
              </div>
              <h3 className="mb-3 font-bold text-xl">Enhance Learning</h3>
              <p className="text-gray-600">
                Improving study outcomes through quality resources and
                innovative learning approaches.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] px-4 md:px-8 lg:px-16 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-12 font-bold text-3xl md:text-4xl text-center section-heading">
            How <span className="text-blue-600">UniNav</span> Works
          </h2>

          <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white shadow-sm p-6 rounded-xl feature-card">
              <div className="flex justify-center items-center bg-blue-100 mb-4 rounded-full w-12 h-12 text-blue-600">
                <Search size={24} />
              </div>
              <h3 className="mb-2 font-semibold text-lg">Discover</h3>
              <p className="text-gray-600 text-sm">
                Find course materials organized by faculty and department with
                powerful search capabilities.
              </p>
            </div>

            <div className="bg-white shadow-sm p-6 rounded-xl feature-card">
              <div className="flex justify-center items-center bg-green-100 mb-4 rounded-full w-12 h-12 text-green-600">
                <BookOpen size={24} />
              </div>
              <h3 className="mb-2 font-semibold text-lg">Access</h3>
              <p className="text-gray-600 text-sm">
                Get instant access to PDFs, articles, videos, and more,
                available for download or viewing.
              </p>
            </div>

            <div className="bg-white shadow-sm p-6 rounded-xl feature-card">
              <div className="flex justify-center items-center bg-purple-100 mb-4 rounded-full w-12 h-12 text-purple-600">
                <BookmarkIcon size={24} />
              </div>
              <h3 className="mb-2 font-semibold text-lg">Save</h3>
              <p className="text-gray-600 text-sm">
                Bookmark resources and create personal collections for organized
                studying.
              </p>
            </div>

            <div className="bg-white shadow-sm p-6 rounded-xl feature-card">
              <div className="flex justify-center items-center bg-amber-100 mb-4 rounded-full w-12 h-12 text-amber-600">
                <PenTool size={24} />
              </div>
              <h3 className="mb-2 font-semibold text-lg">Contribute</h3>
              <p className="text-gray-600 text-sm">
                Upload your own materials and write blogs to share knowledge
                with fellow students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-white px-4 md:px-8 lg:px-16 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-16 font-bold text-3xl md:text-4xl text-center section-heading">
            Key <span className="text-blue-600">Features</span>
          </h2>

          <div className="gap-12 lg:gap-16 grid md:grid-cols-2">
            <div className="feature-card">
              <Image
                src="https://img.freepik.com/free-vector/online-document-concept-illustration_114360-5453.jpg"
                alt="Study Material Management"
                width={500}
                height={350}
                className="shadow-md mb-6 rounded-lg"
              />
              <h3 className="mb-4 font-semibold text-[#003666] text-2xl">
                Study Material Management
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-600">
                    <Check size={18} />
                  </div>
                  <span>
                    Upload PDFs, URLs, and images categorized by course
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-600">
                    <Check size={18} />
                  </div>
                  <span>
                    Organized file structure based on academic hierarchy
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-600">
                    <Check size={18} />
                  </div>
                  <span>Preview materials directly in the platform</span>
                </li>
              </ul>
            </div>

            <div className="feature-card">
              <Image
                src="https://img.freepik.com/free-vector/college-university-students-group-young-happy-people-standing-isolated-white-background_575670-66.jpg"
                alt="Faculty & Department Structure"
                width={500}
                height={350}
                className="shadow-md mb-6 rounded-lg"
              />
              <h3 className="mb-4 font-semibold text-[#003666] text-2xl">
                Faculty & Department Structure
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-600">
                    <Check size={18} />
                  </div>
                  <span>Clear organizational hierarchy for all resources</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-600">
                    <Check size={18} />
                  </div>
                  <span>Easily navigate between related departments</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-600">
                    <Check size={18} />
                  </div>
                  <span>Filter materials by academic level and semester</span>
                </li>
              </ul>
            </div>

            <div className="feature-card">
              <Image
                src="https://img.freepik.com/free-vector/secure-login-concept-illustration_114360-4582.jpg"
                alt="Authentication"
                width={500}
                height={350}
                className="shadow-md mb-6 rounded-lg"
              />
              <h3 className="mb-4 font-semibold text-[#003666] text-2xl">
                Advanced Authentication
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-600">
                    <Check size={18} />
                  </div>
                  <span>
                    Secure registration using university email addresses
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-600">
                    <Check size={18} />
                  </div>
                  <span>Email confirmation for account verification</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-600">
                    <Check size={18} />
                  </div>
                  <span>
                    Role-based access controls for different user types
                  </span>
                </li>
              </ul>
            </div>

            <div className="feature-card">
              <Image
                src="https://img.freepik.com/free-vector/ai-technology-brain-background-vector-digital-transformation-concept_53876-117812.jpg"
                alt="Search & Recommendations"
                width={500}
                height={350}
                className="shadow-md mb-6 rounded-lg"
              />
              <h3 className="mb-4 font-semibold text-[#003666] text-2xl">
                Smart Recommendations
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-600">
                    <Check size={18} />
                  </div>
                  <span>AI-driven suggestions based on academic interests</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-600">
                    <Check size={18} />
                  </div>
                  <span>Personalized resource recommendations</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 text-green-600">
                    <Check size={18} />
                  </div>
                  <span>Advanced search with filtering options</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Benefits */}
      <section className="bg-gradient-to-br from-[#003666] to-[#001c33] px-4 md:px-8 lg:px-16 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-16 font-bold text-white text-3xl md:text-4xl text-center section-heading">
            Why Choose <span className="text-blue-300">UniNav</span>?
          </h2>

          <div className="gap-8 grid md:grid-cols-3">
            <div className="bg-white/10 backdrop-blur-sm p-6 border border-white/20 rounded-xl feature-card">
              <div className="flex justify-center items-center bg-blue-400/30 mb-5 rounded-full w-14 h-14 text-blue-100">
                <Layers size={28} />
              </div>
              <h3 className="mb-3 font-bold text-blue-100 text-xl">
                Structured & Reliable
              </h3>
              <p className="text-blue-50/90">
                No more scattered Google Drive links; everything is in one
                organized, searchable place.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 border border-white/20 rounded-xl feature-card">
              <div className="flex justify-center items-center bg-blue-400/30 mb-5 rounded-full w-14 h-14 text-blue-100">
                <LucideBrain size={28} />
              </div>
              <h3 className="mb-3 font-bold text-blue-100 text-xl">
                Smart Recommendations
              </h3>
              <p className="text-blue-50/90">
                Get materials tailored to your academic needs and learning
                patterns.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-6 border border-white/20 rounded-xl feature-card">
              <div className="flex justify-center items-center bg-blue-400/30 mb-5 rounded-full w-14 h-14 text-blue-100">
                <Building size={28} />
              </div>
              <h3 className="mb-3 font-bold text-blue-100 text-xl">
                Community-Centric
              </h3>
              <p className="text-blue-50/90">
                Built to enhance student collaboration and academic success
                across departments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Plans */}
      <section className="bg-gradient-to-br from-slate-50 to-blue-50 px-4 md:px-8 lg:px-16 py-16">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 font-bold text-3xl md:text-4xl text-center section-heading">
            Future <span className="text-blue-600">Plans</span>
          </h2>
          <p className="mx-auto mb-12 max-w-3xl text-gray-700 text-center">
            We're constantly evolving to better serve the academic community.
            Here's what's coming next:
          </p>

          <div className="gap-8 grid md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white shadow-md p-6 rounded-xl feature-card">
              <div className="flex justify-center items-center bg-purple-100 mb-5 rounded-full w-12 h-12 text-purple-600">
                <MessageSquareText size={24} />
              </div>
              <h3 className="mb-3 font-bold text-xl">
                Enhanced Discussion Forums
              </h3>
              <p className="text-gray-600">
                Topic-specific discussion boards for collaborative
                problem-solving and academic support.
              </p>
            </div>

            <div className="bg-white shadow-md p-6 rounded-xl feature-card">
              <div className="flex justify-center items-center bg-blue-100 mb-5 rounded-full w-12 h-12 text-blue-600">
                <GraduationCap size={24} />
              </div>
              <h3 className="mb-3 font-bold text-xl">Study Group Formation</h3>
              <p className="text-gray-600">
                Tools to help students create and manage course-specific study
                groups.
              </p>
            </div>

            <div className="bg-white shadow-md p-6 rounded-xl feature-card">
              <div className="flex justify-center items-center bg-amber-100 mb-5 rounded-full w-12 h-12 text-amber-600">
                <PenTool size={24} />
              </div>
              <h3 className="mb-3 font-bold text-xl">
                Interactive Note Taking
              </h3>
              <p className="text-gray-600">
                Collaborative note-taking features for shared learning
                experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white px-4 md:px-8 lg:px-16 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-6 font-bold text-3xl md:text-4xl section-heading">
            Join the Academic <span className="text-blue-600">Revolution</span>
          </h2>
          <p className="mb-8 text-gray-700 text-lg">
            Be part of a growing community of students working together to
            enhance learning and academic success.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/auth/signup"
              className="bg-[#003666] hover:bg-blue-800 px-8 py-3 rounded-lg font-medium text-white transition-colors"
            >
              Sign Up Now
            </a>
            <a
              href="/explore"
              className="bg-white hover:bg-gray-100 px-8 py-3 border border-[#003666] rounded-lg font-medium text-[#003666] transition-colors"
            >
              Explore Materials
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
