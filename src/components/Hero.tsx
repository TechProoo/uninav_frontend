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
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const expandSearch = () => {
    setSearchExpanded(true);
    // Focus the input after expanding
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  // Handle clicks outside the search box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchExpanded &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node) &&
        !searchQuery
      ) {
        setSearchExpanded(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchExpanded, searchQuery]);

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
        <div className="w-full max-w-xl">
          {/* Interactive Decorative Element */}
          <div className="mb-4 flex items-center">
            <div className="h-1 w-8 bg-blue-400 rounded-full mr-3"></div>
            <span className="text-blue-300 font-medium">Start Learning Today</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            The Ultimate <span className="text-blue-300">Study Platform</span> for University Students
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-100 mb-8 max-w-md">
            {isAuthenticated && user
              ? `Welcome back, ${user.firstName}! Ready to continue your learning journey?`
              : "Access, Share & Discover Academic Resources Organized by Faculty, Department, and Course."}
          </p>

          {/* Search Bar */}
          <div className="mb-8 relative">
            <form onSubmit={handleSearch} className="relative">
              <div
                className={`flex items-center bg-white/95 rounded-full overflow-hidden transition-all duration-300 shadow-lg ${
                  searchExpanded ? "w-full" : "w-12 h-12 md:w-64"
                }`}
              >
                <button
                  type="button"
                  className={`p-3 text-gray-600 ${searchExpanded ? "" : "w-full"}`}
                  onClick={expandSearch}
                >
                  <Search size={searchExpanded ? 20 : 24} placeholder="Find anything" />
                </button>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search courses, materials, blogs..."
                  className={`py-3 w-full outline-none px-2 bg-transparent ${
                    searchExpanded ? "opacity-100" : "opacity-0 w-0"
                  }`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            {isAuthenticated && user ? (
              <>
                <ButtonSlider
                  onClick={() => navigateTo("/dashboard")}
                  text={"Visit Dashboard"}
                />
                <ButtonSlider
                  onClick={() => navigateTo("/dashboard/materials?action=create")}
                  text={"Upload Material"}
                />
              </>
            ) : (
              <>
                <ButtonSlider
                  onClick={() => navigateTo("/auth/login")}
                  text={"Get Started"}
                />
                <ButtonSlider
                  text={"Learn More"}
                  onClick={() => navigateTo("/about")}
                />
              </>
            )}
          </div>
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
            <div className="text-2xl md:text-3xl font-bold text-white">5000+</div>
            <div className="text-blue-300 text-sm">Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">200+</div>
            <div className="text-blue-300 text-sm">Courses</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">10+</div>
            <div className="text-blue-300 text-sm">Universities</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-white">1000+</div>
            <div className="text-blue-300 text-sm">Resources</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Add these animations to your globals.css or create a new CSS module
// @keyframes float {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-10px); }
// }
// 
// @keyframes float-delay {
//   0%, 100% { transform: translateY(0); }
//   50% { transform: translateY(-15px); }
// }
// 
// .animate-float {
//   animation: float 6s ease-in-out infinite;
// }
// 
// .animate-float-delay {
//   animation: float-delay 8s ease-in-out infinite;
// }
