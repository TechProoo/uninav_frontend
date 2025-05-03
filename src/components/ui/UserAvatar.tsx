"use client";

import React from "react";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LayoutDashboard, LogOut, User, Bookmark } from "lucide-react";

interface UserAvatarProps {
  showName?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ showName = false }) => {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const initials = `${user.firstName?.charAt(0) || ""}${
    user.lastName?.charAt(0) || ""
  }`;

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  // Truncate name if it's longer than 6 characters
  const displayName = `${user.firstName} ${user.lastName}`;
  const truncatedName =
    displayName.length > 6 ? `${displayName.substring(0, 6)}...` : displayName;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="group relative cursor-pointer">
          {showName ? (
            <div className="flex items-center bg-blue-950/80 hover:bg-blue-950/95 px-1.5 py-1 rounded-full transition-colors">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary/90 text-white text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="ml-1.5 font-medium text-white text-sm">
                {truncatedName}
              </span>
            </div>
          ) : (
            <div className="relative">
              <Avatar className="group-hover:ring-primary ring-2 ring-primary/80 w-10 h-10 transition-all duration-300">
                <AvatarFallback className="bg-primary/90 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="-top-8 absolute opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-300 transform">
                <div className="bg-primary px-3 py-1 rounded-full font-medium text-white text-xs whitespace-nowrap">
                  Hi {user.firstName}
                </div>
              </div>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center gap-2 p-2">
          <Avatar className="w-9 h-9">
            <AvatarFallback className="bg-primary/90 text-white">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            <p className="font-medium text-sm">{`${user.firstName} ${user.lastName}`}</p>
            <p className="text-gray-500 text-xs">{user.email}</p>
          </div>
        </div>
        <DropdownMenuSeparator />

        {/* Regular User Section */}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleNavigation("/dashboard")}
        >
          <LayoutDashboard className="mr-2 w-4 h-4" />
          <span>Dashboard</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleNavigation("/dashboard/bookmarks")}
        >
          <Bookmark className="mr-2 w-4 h-4" />
          <span>Bookmarks</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleNavigation("/dashboard/profile")}
        >
          <User className="mr-2 w-4 h-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500 hover:text-red-600 cursor-pointer"
          onClick={logout}
        >
          <LogOut className="mr-2 w-4 h-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAvatar;
