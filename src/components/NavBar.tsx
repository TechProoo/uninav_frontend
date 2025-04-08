"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../public/Image/logoo.png";
import { useAuth } from "@/contexts/authContext";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/ui/UserAvatar";

const NavBar = () => {
  const { isAuthenticated, loading } = useAuth();

  return (
    <nav className="top-0 z-50 sticky bg-white/90 backdrop-blur-md py-3 border-gray-200 border-b">
      <div className="flex justify-between items-center mx-auto px-4 container">
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src={Logo}
            alt="UniNav Logo"
            className="w-auto h-8"
            width={40}
            height={40}
          />
          <span className="font-bold text-xl">UniNav</span>
        </Link>

        <div className="flex items-center space-x-4">
          {loading ? (
            <div className="bg-gray-200 rounded-full w-8 h-8 animate-pulse"></div>
          ) : isAuthenticated ? (
            <UserAvatar />
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
