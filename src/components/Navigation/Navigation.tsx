"use client";

import React, { useState, useEffect } from "react";
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
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-md rounded-b-xl" 
          : "bg-transparent"
      } ${isHidden && isScrolled ? "-translate-y-full" : "translate-y-0"}`}
    >
      <nav className="mx-auto px-4 py-3 max-w-[1400px]">
        <div className="flex justify-between items-center h-14">
          <Link href={"/"} className="flex items-center nav_logo">
            <div className={`relative overflow-hidden rounded-lg ${isScrolled ? "" : "bg-white/10 backdrop-blur-sm p-1"}`}>
              <Image
                className="mr-2 w-10 h-auto"
                src="/Image/uninav-logo.svg"
                width={40}
                height={40}
                alt="UniNav Logo"
              />
            </div>
            <span className={`hidden sm:block font-semibold text-xl ml-2 transition-colors ${isScrolled || !isHomePage ? "text-[#003666]" : "text-white"}`}>
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
                  className={`relative px-4 py-2 mx-1 rounded-full font-medium transition-all ${
                    isActive(item.path)
                      ? isScrolled || !isHomePage 
                        ? "text-blue-600 bg-blue-50" 
                        : "text-white bg-white/10 backdrop-blur-sm"
                      : isScrolled || !isHomePage 
                        ? "text-gray-700 hover:bg-gray-100" 
                        : "text-white/95 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
                  )}
                </Link>
              ))}
            </ul>
            
            {/* Search Icon for Desktop */}
            <button 
              onClick={() => setSearchOpen(true)}
              className={`ml-4 p-2 rounded-full ${
                isScrolled || !isHomePage ? "text-gray-600 hover:bg-gray-100" : "text-white hover:bg-white/10"
              }`}
            >
              <Search size={18} />
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Overlay - Full Screen Search */}
            {searchOpen && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="w-full max-w-2xl px-4">
                  <form onSubmit={handleSearch} className="relative">
                    <div className="flex items-center bg-white rounded-lg overflow-hidden">
                      <input
                        type="text"
                        placeholder="Search courses, materials, blogs..."
                        className="w-full py-4 px-5 outline-none text-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                      <button type="submit" className="px-5 py-4 bg-blue-600 text-white">
                        <Search size={20} />
                      </button>
                    </div>
                  </form>
                  <button 
                    onClick={() => setSearchOpen(false)}
                    className="absolute top-10 right-10 text-white p-2 rounded-full hover:bg-white/20"
                  >
                    <X size={30} />
                  </button>
                </div>
              </div>
            )}

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
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  <Search size={18} />
                </button>
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
