"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Search,
  BellIcon,
  Megaphone,
  BookOpen,
  PencilLine,
  User,
  Bookmark,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

import ProtectedRoute from "@/auth/ProtectedRoute";
import { BadgeDemo } from "@/components/ui/BadgeUi";
import { TooltipDemo } from "@/components/ui/TooltipUi";
import { useAuth } from "@/contexts/authContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/blog/dashboard-sidebar";

const getMenuItems = (role?: string) => {
  const items = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Manage Materials", path: "/dashboard/materials" },
    { icon: Bookmark, label: "Manage Bookmarks", path: "/dashboard/bookmarks" },
    {
      icon: GraduationCap,
      label: "Manage Courses",
      path: "/dashboard/courses",
    },
    { icon: Megaphone, label: "Manage Ads", path: "/dashboard/ads" },
    { icon: PencilLine, label: "Manage Blogs", path: "/dashboard/blogs" },
  ];

  if (role === "admin" || role === "moderator") {
    items.push({
      icon: ShieldCheck,
      label: "Site Management",
      path: "/dashboard/management",
    });
  }

  items.push({ icon: User, label: "Profile", path: "/dashboard/profile" });
  items.push({
    icon: Settings,
    label: "Settings",
    path: "/dashboard/settings",
  });

  return items;
};

interface LayoutProp {
  children: ReactNode;
}

const SidebarLayout: React.FC<LayoutProp> = ({ children }) => {
  const router = useRouter();
  const { logout, isAuthenticated, user } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = () => {
    if (!searchValue.trim()) return;
    router.push(`/explore?value=${encodeURIComponent(searchValue)}`);
  };

  // Apply a small translation based on scroll position, but limit it
  const headerTransform = `translateY(${Math.min(
    scrollPosition * 0.05,
    10
  )}px)`;

  return (
    <SidebarProvider>
      <div className="flex bg-slate-50 w-full h-screen overflow-hidden">
        <DashboardSidebar />
        <ProtectedRoute>
          <main className="flex flex-col flex-1 w-full overflow-hidden">
            <header
              className="top-0 z-50 sticky flex justify-between items-center bg-[#003462]/90 shadow-md backdrop-blur-sm p-4 border-b w-full"
              style={{
                // transform: headerTransform,
                transition: "transform 0.1s ease-out",
              }}
            >
              <SidebarTrigger
                style={{ color: "white" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#aaddff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
              />

              <div className="flex justify-between items-center w-full">
                {/* Search Bar */}
                <div className="flex items-center bg-white ml-4 border rounded-md overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search"
                    name="search"
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="px-2 py-1 focus:outline-none w-40 sm:w-52 md:w-64 text-black transition-all duration-300 ease-in-out"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-[#f0f8ff] px-3 py-1"
                  >
                    <Search className="text-[#0c385f]" />
                  </button>
                </div>

                {/* Notification & Welcome */}
                <div className="flex items-center gap-4 ml-auto">
                  <TooltipDemo
                    text={<BellIcon size={18} color="#f0f8ff" />}
                    notify="Notification"
                  />
                  <BadgeDemo text={`Welcome ${user?.firstName || "User"}`} />
                </div>
              </div>
            </header>
            <div className="flex-1 w-full overflow-y-auto">
              <div className="w-full">{children}</div>
            </div>
          </main>
        </ProtectedRoute>
      </div>
    </SidebarProvider>
  );
};

export default SidebarLayout;
