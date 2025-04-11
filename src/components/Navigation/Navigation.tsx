"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "../ui/Button-styled";
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

const Navigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(true);
  const isHomePage = pathname === "/";

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const scrollPosition = window.scrollY;
  //     setIsScrolled(scrollPosition > 20);
  //   };

  //   window.addEventListener("scroll", handleScroll);
  //   return () => window.removeEventListener("scroll", handleScroll);
  // }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
    { label: "Explore", path: "/explore" },
  ];

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
              <Link href={"/"} className="hover:text-primary nav_link">
                Home
              </Link>
              <Link href={"/about"} className="hover:text-primary nav_link">
                About
              </Link>
              <Link href={"/contact"} className="hover:text-primary nav_link">
                Contact
              </Link>
              <Link href={"/explore"} className="hover:text-primary nav_link">
                Explore
              </Link>
              {user && (
                <Link
                  href={"/dashboard"}
                  className="hover:text-primary nav_link"
                >
                  Dashboard
                </Link>
              )}
            </li>
          </ul>

          <div className="flex items-center gap-4">
            {/* User Authentication Status */}
            {loading ? (
              <div className="bg-gray-200 rounded-full w-8 h-8 animate-pulse"></div>
            ) : isAuthenticated ? (
              <UserAvatar showName={true} />
            ) : (
              <div className="hidden md:flex gap-4 nav_btn">
                <Button
                  onClick={() => handleNavigation("/auth/login")}
                  text={"Login"}
                  className="py-1.5 text-sm"
                />
                <Button
                  onClick={() => handleNavigation("/auth/signup")}
                  text="SignUp"
                  className="py-1.5 text-sm"
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
              <SheetClose asChild>
                <button
                  className="hover:bg-gray-100 p-1 rounded-full"
                  aria-label="Close mobile menu"
                >
                  <X size={20} />
                </button>
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="flex flex-col p-4">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className="hover:bg-gray-100 px-3 py-3 rounded-md text-base text-left transition-colors"
              >
                {item.label}
              </button>
            ))}

            {!isAuthenticated && (
              <div className="flex flex-col gap-2 mt-4">
                <button
                  onClick={() => handleNavigation("/auth/login")}
                  className="py-3 border border-blue-600 rounded-md font-medium text-blue-600 text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => handleNavigation("/auth/signup")}
                  className="bg-blue-600 py-3 rounded-md font-medium text-white text-center"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Navigation;
