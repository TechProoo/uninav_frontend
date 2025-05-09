"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonSlider } from "@/components/ui/ButtonSlider";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import UserAvatar from "@/components/ui/UserAvatar";

const Navbar = () => {
  const router = useRouter();

  const { isAuthenticated, loading } = useAuth();
  const handleNavigation = (path: string) => router.push(path);

  return (
    <div className="relative bg-white/95 shadow-md">
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
          <ul className="hidden md:block">
            <li className="flex items-center gap-8 nav_li">
              <Link href={"/about"} className="hover:text-primary nav_link">
                About
              </Link>
              <Link href={"/contact"} className="hover:text-primary nav_link">
                Contact
              </Link>
              <Link href={"/search"} className="hover:text-primary nav_link">
                Explore
              </Link>
            </li>
          </ul>
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="bg-gray-200 rounded-full w-8 h-8 animate-pulse"></div>
            ) : isAuthenticated ? (
              <UserAvatar showName={true} />
            ) : (
              <div className="hidden md:flex justify-center items-center gap-8 nav_btn">
                <Link
                  className="py-1.5 text-[#003666] text-[17px]"
                  href="/auth/login"
                >
                  LOGIN
                </Link>

                <ButtonSlider
                  onClick={() => handleNavigation("/auth/signup")}
                  text="SignUp"
                  className="py-1.5 text-sm"
                />
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
