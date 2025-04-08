"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import {
  LayoutDashboard,
  Settings,
  ChevronRight,
  Menu,
  Search,
  UploadCloud,
  User,
  BookOpen,
  PencilLine,
  BellIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProtectedRoute from "@/auth/ProtectedRoute";
import { BadgeDemo } from "@/components/ui/BadgeUi";
import { TooltipDemo } from "@/components/ui/TooltipUi";
import { useAuth } from "@/contexts/authContext";
import Logo from "../../../public/Image/logoo.png";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: BookOpen, label: "Manage Materials", path: "/dashboard/materials" },
  { icon: PencilLine, label: "Manage Blogs", path: "/dashboard/blogs" },
  { icon: User, label: "Profile", path: "/dashboard/profile" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

interface LayoutProp {
  children: ReactNode;
}

const SidebarLayout: React.FC<LayoutProp> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { logout, isAuthenticated, user } = useAuth();

  // Handle auth redirect
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  // Toggle sidebar on desktop
  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Animate sidebar width with GSAP
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar || !isDesktop) return;

    gsap.to(sidebar, {
      width: isSidebarOpen ? 260 : 0,
      opacity: isSidebarOpen ? 1 : 0,
      duration: 0.3,
      ease: "power1.inOut",
    });
  }, [isSidebarOpen, isDesktop]);

  // Detect screen size to conditionally render sidebar
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768); // md breakpoint
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (only on desktop) */}
      {isDesktop && (
        <aside
          ref={sidebarRef}
          className="sidebar relative z-40 h-full w-64 border-r overflow-y-auto"
        >
          <div className="p-4">
            <div className="flex flex-col items-center mb-6">
              <Image className="w-50 h-auto" src={Logo} alt="Logo" />
            </div>

            <nav className="px-2">
              <ul className="flex flex-col gap-2">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-white hover:bg-[#003462] text-[#003462]"
                  >
                    <item.icon />
                    {item.label}
                  </Link>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <header className="p-4 border-b flex justify-between items-center bg-[#003462] shadow-sm">
          {/* Sidebar Toggle Button (only on desktop) */}
          {isDesktop && (
            <button className="p-2 text-white" onClick={toggleSidebar}>
              {isSidebarOpen ? <ChevronRight size={18} /> : <Menu size={18} />}
            </button>
          )}

          <div className="flex items-center w-full justify-between">
            {/* Search bar (desktop only) */}
            {isDesktop && (
              <div className="flex items-center border rounded-md overflow-hidden">
                <input
                  type="text"
                  placeholder="Search"
                  className="px-2 py-1 text-white focus:outline-none w-54 focus:w-84 transition-all duration-300 ease-in-out bg-transparent"
                />
                <button className="px-3 py-1 bg-[#f0f8ff]">
                  <Search className="text-[#0c385f]" />
                </button>
              </div>
            )}

            {/* Right Side Icons */}
            <div className="flex items-center gap-4 ml-auto">
              <TooltipDemo
                text={<BellIcon size={15} color="#f0f8ff" />}
                notify="Notification"
              />
              <BadgeDemo text={`Welcome ${user?.firstName || "User"}`} />
            </div>
          </div>
        </header>

        <ProtectedRoute>
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto w-full">
            {children}
          </main>
        </ProtectedRoute>
      </div>
    </div>
  );
};

export default SidebarLayout;
