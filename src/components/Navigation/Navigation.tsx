"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonSlider } from "../ui/ButtonSlider";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import UserAvatar from "@/components/ui/UserAvatar";
import { Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "../ui/sheet";
import GoogleButton from "../ui/GoogleButton";

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(true);
  const isHomePage = pathname === "/";

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

  const menuItems = [
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Explore", path: "/explore" },
    { label: "Course Map", path: "/course-map" },
  ];

  // Add dashboard to menu items if user is logged in
  if (user) {
    menuItems.push({ label: "Dashboard", path: "/dashboard" });
  }

  return (
    <div
      className={`top-0 z-50 w-full bg-white/95 shadow-md ${
        isHomePage ? "sticky" : isScrolled ? "relative" : "fixed"
      }`}
    >
      <nav className="mx-auto px-4 py-2 max-w-[1400px]">
        <div className="flex justify-between items-center h-14">
          <Link href={"/"} className="flex items-center nav_logo">
            <Image
              className="mr-2 w-10 h-auto"
              src="/Image/uninav-logo.svg"
              width={40}
              height={40}
              alt="UniNav Logo"
            />
            <span className="hidden sm:block font-semibold text-[#003666] text-xl">
              UniNav
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:block">
            <li className="flex items-center gap-8 nav_li">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`nav_link ${
                    isActive(item.path)
                      ? "font-bold text-[#003666] after:w-full before:w-full"
                      : "hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </li>
          </ul>

          <div className="flex items-center gap-4">
            {/* User Authentication Status */}
            {loading ? (
              <div className="bg-gray-200 rounded-full w-8 h-8 animate-pulse"></div>
            ) : isAuthenticated ? (
              <UserAvatar showName={true} />
            ) : (
              <div className="flex justify-center items-center gap-4 nav_btn">
                {/* <GoogleButton iconOnly className="hidden md:inline-flex" title="Sign in with Google" /> */}
                <ButtonSlider
                  onClick={() => handleNavigation("/auth/login")}
                  text="Login"
                />
                <ButtonSlider
                  onClick={() => handleNavigation("/auth/signup")}
                  text="SignUp"
                />
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              className="md:hidden flex items-center"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu size={24} />
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
              {/* <SheetClose asChild>
                <button
                  className="hover:bg-gray-100 p-1 rounded-full"
                  aria-label="Close mobile menu"
                >
                  <X size={20} />
                </button>
              </SheetClose> */}
            </div>
          </SheetHeader>

          <div className="flex flex-col p-4">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`px-3 py-3 rounded-md text-base text-left transition-colors ${
                  isActive(item.path)
                    ? "bg-blue-50 text-[#003666] font-medium border-l-4 border-[#003666]"
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
