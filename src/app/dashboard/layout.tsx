"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Settings,
  Search,
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

  return items;
};

interface LayoutProp {
  children: ReactNode;
}

const SidebarLayout: React.FC<LayoutProp> = ({ children }) => {
  const router = useRouter();
  const { logout, isAuthenticated, user } = useAuth();
  // const [searchValue, setSearchValue] = useState("");
  const [modal, setModal] = useState(false);
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
                transition: "transform 0.1s ease-out",
              }}
            >
              <SidebarTrigger
                style={{ color: "white", verticalAlign: "top" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#aaddff")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
              />

              <div className="flex sm:flex-row flex-col-reverse sm:justify-end sm:items-center gap-3 w-full">
                <div className="flex justify-end sm:justify-start">
                  <BadgeDemo text={`Welcome ${user?.firstName || "User"}`} />
                </div>
              </div>
            </header>
            <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 w-full overflow-y-auto">
              <div className="w-full">{children}</div>
            </div>
          </main>
        </ProtectedRoute>
      </div>
    </SidebarProvider>
  );
};

export default SidebarLayout;
