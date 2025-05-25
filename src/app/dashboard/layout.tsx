"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  AlertCircle,
  User,
  PencilLine,
  Megaphone,
  GraduationCap,
  Bookmark,
} from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Toaster } from "@/components/ui/toaster";

import ProtectedRoute from "@/auth/ProtectedRoute";
import { BadgeDemo } from "@/components/ui/BadgeUi";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/blog/dashboard-sidebar";
import UserAvatar from "@/components/ui/UserAvatar";

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
  const pathname = usePathname();
  const { logout, isAuthenticated, user, loading } = useAuth();
  const { toast } = useToast();
  const [modal, setModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

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

  if (loading || !isClient) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex bg-slate-50 w-full h-screen overflow-hidden">
        <DashboardSidebar />
        <ProtectedRoute>
          <main className="flex flex-col flex-1 w-full overflow-hidden">
            <header
              className="top-0 z-50 sticky flex flex-col bg-[#003462]/90 shadow-md backdrop-blur-sm p-4 border-b w-full"
              style={{
                transition: "transform 0.1s ease-out",
              }}
            >
              {/* Top bar: Sidebar toggler left, badge right */}
              <div className="flex flex-row items-center justify-between w-full">
                <SidebarTrigger
                  style={{ color: "white", verticalAlign: "top" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#aaddff")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
                />
                  {/* <BadgeDemo text={`Welcome ${user?.firstName || "User"}`} /> */}
                  <UserAvatar showName={true}/>
              </div>
              {/* Red alert below the top bar */}
              {!user?.departmentId && (
                <div className="w-full bg-red-600 text-white text-xs py-1 px-2 rounded mb-2 flex items-center justify-center mt-2">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Please complete your profile information by setting your department in your profile settings.
                </div>
              )}
            </header>
            <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 w-full overflow-y-auto">
              <div className="w-full">{children}</div>
            </div>
          </main>
        </ProtectedRoute>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};

export default SidebarLayout;
