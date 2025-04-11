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
import { AppSidebar } from "@/components/blog/app-sidebar";
import { Modal } from "@/components/search/modal";

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
  // const [searchValue, setSearchValue] = useState("");
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  // const handleSearch = () => {
  //   if (!searchValue.trim()) return;
  //   router.push(`/search?value=${encodeURIComponent(searchValue)}`);
  // };

  const handleModal = () => {
    setModal((s) => !s);
  };

  console.log(modal);

  return (
    <SidebarProvider>
      <AppSidebar />
      <ProtectedRoute>
        <main className="flex-1 w-full overflow-y-auto">
          <header className="flex justify-between items-center bg-[#003462]/90 backdrop-blur-sm w-full sticky top-0 z-50 shadow-sm p-4 border-b">
            <SidebarTrigger
              style={{ color: "white" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "black")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "white")}
            />

            <div className="flex justify-between items-center w-full">
              {/* Search Bar */}
              <div className="flex items-center bg-white border rounded-md overflow-hidden">
                {/* <input
                  type="text"
                  placeholder="Search"
                  name="search"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="px-2 py-1 focus:outline-none w-40 focus:w-64 text-black transition-all duration-300 ease-in-out"
                /> */}

                {/* <button
                  onClick={handleSearch}
                  className="bg-[#f0f8ff] px-3 py-1"
                >
                  <Search className="text-[#0c385f]" />
                </button> */}
              </div>

              {/* Notification & Welcome */}
              <div className="flex items-center gap-4 ml-auto">
                <div
                  className="bg-white p-1 rounded-md cursor-pointer active:scale-95 transition-transform"
                  onClick={handleModal}
                >
                  <Search className="text-[#0c385f]" />
                </div>
                {modal && <Modal isOpen={modal} onClose={handleModal} />}
                <BadgeDemo text={`Welcome ${user?.firstName || "User"}`} />
              </div>
            </div>
          </header>
          <div className="md:m-10 m-5">{children}</div>
        </main>
      </ProtectedRoute>
    </SidebarProvider>
  );
};

export default SidebarLayout;
