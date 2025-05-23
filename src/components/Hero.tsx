"use client";

import Image from "next/image";
import HeroImage from "../../public/Image/shelf-of-books.jpg";
import { ButtonSlider } from "@/components/ui/ButtonSlider";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

export default function Hero() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchFormRef = useRef<HTMLFormElement>(null);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSearchFocus = () => {
    setSearchFocused(true);
  };

  const handleSearchBlur = () => {
    if (!searchQuery.trim()) {
      setSearchFocused(false);
    }
  };

  return (
    <div className="relative w-full min-h-[85vh] overflow-hidden">
      {/* Background Layer with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={HeroImage}
          alt="Library"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-blue-800/75 to-transparent"></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full py-16 md:py-24 flex flex-col justify-center">
        <div className="w-full">
          <div className="max-w-xl">
            {/* Interactive Decorative Element */}
            {/* <div className="mb-4 flex items-center">
              <div className="h-1 w-8 bg-blue-400 rounded-full mr-3"></div>
              <span className="text-blue-300 font-medium">Start Learning Today</span>
            </div> */}

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl py-4 font-bold text-white mb-4 leading-tight">
              The Ultimate <span className="text-blue-300">Study Platform</span> for <span className='text-nowrap'>  University Students</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-md">
              {isAuthenticated && user
                ? `Welcome back, ${user.firstName}! Ready to continue your learning journey?`
                : "Access, Share & Discover Academic Resources Organized by Faculty, Department, and Course."}
            </p>
          </div>

          {/* Search Bar - Fully Expanded By Default */}
          <div className="mb-8 flex justify-center w-full">
            <form 
              ref={searchFormRef}
              onSubmit={handleSearch} 
              className="relative w-full max-w-3xl mx-auto"
            >
              <div
                className={`flex items-center bg-white/95 rounded-full overflow-hidden transition-all duration-300 shadow-lg w-full ${
                  searchFocused ? "scale-105 shadow-xl" : ""
                }`}
              >
                <div className="p-3 text-gray-600">
                  <Search size={20} />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search courses, materials, blogs..."
                  className="py-3 h-[5vw] w-full outline-none px-2 bg-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                />
              </div>
            </form>
          </div>

          {/* CTA Buttons - Attractive Center Layout */}
          {/* <div className="flex flex-wrap justify-center gap-6 md:mb-8 mx-auto w-full">
            {isAuthenticated && user ? (
              <>
                <ButtonSlider
                  onClick={() => navigateTo("/dashboard")}
                  text={"Visit Dashboard"}
                  className="min-w-[180px] text-center"
                />
                <ButtonSlider
                  onClick={() => navigateTo("/dashboard/materials?action=create")}
                  text={"Upload Material"}
                  className="min-w-[180px] text-center"
                />
              </>
            ) : (
              <>
                <ButtonSlider
                  onClick={() => navigateTo("/auth/login")}
                  text={"Get Started"}
                  className="min-w-[150px] text-center"
                />
                <ButtonSlider
                  text={"Learn More"}
                  onClick={() => navigateTo("/about")}
                  className="min-w-[150px] text-center"
                />
              </>
            )}
          </div> */}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-10 right-10 z-10 hidden lg:block">
        <div className="relative w-20 h-20 rounded-full bg-blue-400/20 backdrop-blur-sm border border-blue-300/30 animate-float"></div>
      </div>
      <div className="absolute top-20 right-20 z-10 hidden lg:block">
        <div className="relative w-12 h-12 rounded-full bg-yellow-400/20 backdrop-blur-sm border border-yellow-300/30 animate-float-delay"></div>
      </div>

      {/* Stats Counter Section at the Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">50+</div>
            <div className="text-blue-300 text-sm">Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">100+</div>
            <div className="text-blue-300 text-sm">Courses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">3+</div>
            <div className="text-blue-300 text-sm">Departments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">100+</div>
            <div className="text-blue-300 text-sm">Resources</div>
          </div>
        </div>
      </div>
    </div>
  );
}