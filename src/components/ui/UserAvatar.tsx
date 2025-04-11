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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="cursor-pointer">
          {showName ? (
            <div className="flex items-center bg-white/80 hover:bg-white/95 px-2 py-1.5 rounded-full transition-colors">
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-primary/90 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="ml-2 font-semibold text-primary">
                {user.firstName} {user.lastName}
              </span>
            </div>
          ) : (
            <Avatar className="hover:ring-2 hover:ring-primary/50 w-9 h-9 transition-all">
              <AvatarFallback className="bg-primary/90 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
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
          onClick={() => handleNavigation("/dashboard/bookmark")}
        >
          <Bookmark className="mr-2 w-4 h-4" />
          <span>Bookmarks</span>
        </DropdownMenuItem>

        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => handleNavigation("/profile")}
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
