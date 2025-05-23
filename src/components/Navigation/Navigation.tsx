"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonSlider } from "../ui/ButtonSlider";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import UserAvatar from "@/components/ui/UserAvatar";
import { Menu, X, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const isHomePage = pathname === "/";
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [lastScrollY, setLastScrollY] = useState(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Handle scroll for navbar appearance and hide/show behavior
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update transparency state
      if (currentScrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Hide/show based on scroll direction (only when we're past the initial threshold)
      if (currentScrollY > 150) {
        if (currentScrollY > lastScrollY) {
          // Scrolling down - hide navbar
          setIsHidden(true);
        } else {
          // Scrolling up - show navbar
          setIsHidden(false);
        }
      }

      // Update last scroll position
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Handle clicks outside the search container
  useEffect(() => {
    if (!searchOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    // For dashboard pages, consider all dashboard routes as active for the dashboard link
    if (path === "/dashboard" && pathname?.startsWith("/dashboard")) {
      return true;
    }
    // For exact matches
    return pathname === path;
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const menuItems = [
    { label: "Explore", path: "/explore" },
    { label: "Course Map", path: "/course-map" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  // Add dashboard to menu items if user is logged in
  if (user) {
    menuItems.push({ label: "Dashboard", path: "/dashboard" });
  }

  return (
    <div
      className={"fixed top-0 z-50 w-full transition-all duration-300 bg-white backdrop-blur-md shadow-md mb-3"}
    >
      <nav className="mx-auto px-4 py-3 max-w-[1400px]">
        <div className="flex justify-between items-center h-14">
          <Link href={"/"} className="flex items-center nav_logo">
            <div className={`relative overflow-hidden rounded-lg `}>
              <Image
                className="mr-2 w-10 h-auto"
                src="/Image/uninav-logo.svg"
                width={40}
                height={40}
                alt="UniNav Logo"
              />
            </div>
            <span className={`hidden sm:block font-semibold text-xl ml-2 transition-colors text-[#003666]`}>
              UniNav
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <ul className="flex items-center gap-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`relative px-4 py-2 mx-1 rounded-full font-medium transition-all text-[#003666]`}>
                  {item.label}
                  {isActive(item.path) && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
                  )}
                </Link>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Icon - Moved to right side */}
            <button 
              onClick={() => setSearchOpen(true)}
              className={`p-2 rounded-full transition-all hover:scale-105 ${
                isScrolled || !isHomePage 
                  ? "text-gray-600 hover:bg-gray-100" 
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Open search"
            >
              <Search size={20} />
            </button>

            {/* User Authentication Status */}
            {loading ? (
              <div className="bg-gray-200 rounded-full w-8 h-8 animate-pulse"></div>
            ) : isAuthenticated ? (
              <UserAvatar showName={true} />
            ) : (
              <div className="flex justify-center items-center gap-2 nav_btn">
                <ButtonSlider
                  onClick={() => handleNavigation("/auth/login")}
                  text="Login"
                  className={isScrolled || !isHomePage ? "" : "bg-white/10 text-white hover:bg-white/20"}
                />
                <ButtonSlider
                  onClick={() => handleNavigation("/auth/signup")}
                  text="SignUp"
                  className={isScrolled || !isHomePage ? "" : "bg-blue-500 text-white hover:bg-blue-600"}
                />
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              className="md:hidden flex items-center"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu size={24} className={isScrolled || !isHomePage ? "text-gray-700" : "text-white"} />
            </button>
          </div>
        </div>
      </nav>

      {/* Enhanced Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 sm:pt-40 transition-all duration-300">
          {/* Invisible backdrop - only for click handling - now handled by useEffect */}
          
          {/* Search Container */}
          <div ref={searchContainerRef} className="relative w-full max-w-3xl px-4 z-10 animate-fade-in-down">
            {/* Close Button with enhanced visibility */}
            <button 
              onClick={() => setSearchOpen(false)}
              className="absolute -top-16 right-4 bg-white/20 text-white p-2.5 rounded-full hover:bg-white/30 transition-all shadow-lg backdrop-blur-sm"
            >
              <X size={24} strokeWidth={3} className="text-blue-900" />
            </button>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <div className="flex flex-col">
                {/* Removed title for cleaner look */}
                
                <div className="flex items-center bg-white rounded-2xl overflow-hidden shadow-2xl border border-blue-100">
                  <input
                    type="text"
                    placeholder="Search courses, materials, blogs..."
                    className="w-full py-4 sm:py-5 px-6 outline-none text-base sm:text-lg text-gray-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <button 
                    type="submit" 
                    className="h-full px-6 py-4 sm:py-5 bg-gradient-to-r from-[#003666] to-[#0055a4] text-white transition-all hover:from-[#004680] hover:to-[#0066c2]"
                  >
                    <Search size={22} />
                  </button>
                </div>
                
                {/* Quick Search Suggestions */}
                <div className="mt-6 flex flex-wrap gap-2 justify-center">
                  <span className="text-sm text-blue-200 mr-2">Popular:</span>
                  {["MAT", "PHY", "STA", "GES", "BIO"].map((term) => (
                    <button
                      key={term}
                      type="button"
                      className="px-3 py-1.5 bg-blue-500/20 hover:bg-blue-600/30 text-blue-900 text-sm rounded-full transition-colors border border-blue-200/50"
                      onClick={() => {
                        setSearchQuery(term);
                      }}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Sidebar as Sheet */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="right" className="p-0 w-[300px] sm:w-[350px]">
          <SheetHeader className="p-4 border-b">
            <div className="flex justify-between items-center w-full">
              <div className="flex items-center gap-2">
                <Image
                  src="/Image/uninav-logo.svg"
                  width={32}
                  height={32}
                  alt="UniNav Logo"
                />
                <SheetTitle className="font-semibold text-[#003666] text-lg">
                  UniNav
                </SheetTitle>
              </div>
            </div>
          </SheetHeader>

          <div className="flex flex-col p-4">
            {/* Search Field for Mobile */}
            <div className="mb-6">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center overflow-hidden rounded-lg border border-gray-300">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full py-3 px-4 outline-none text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="p-3 bg-[#003666] text-white"
                  >
                    <Search size={18} />
                  </button>
                </div>
              </form>
            </div>

            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`px-3 py-3 rounded-md text-base text-left transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navigation;

// Add this to globals.css if not already present
// @keyframes fade-in-down {
//   0% {
//     opacity: 0;
//     transform: translateY(-20px);
//   }
//   100% {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
// .animate-fade-in-down {
//   animation: fade-in-down 0.3s ease-out forwards;
// }
