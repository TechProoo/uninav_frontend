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
  BellIcon,
  Megaphone,
  BookOpen,
  PencilLine,
  User,
  Bookmark,
  GraduationCap,
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
  { icon: Bookmark, label: "Manage Bookmarks", path: "/dashboard/bookmarks" },
  { icon: GraduationCap, label: "Manage Courses", path: "/dashboard/courses" },
  { icon: Megaphone, label: "Manage Ads", path: "/dashboard/ads" },
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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

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

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {isDesktop && (
        <aside
          ref={sidebarRef}
          className={`sidebar h-full border-r overflow-y-auto bg-white ${
            isSidebarOpen ? "w-64" : "w-0"
          }`}
        >
          <div className="p-4">
            <div className="flex flex-col items-center mb-6">
              <Image className="w-40 h-auto" src={Logo} alt="Logo" />
            </div>

            <nav className="px-2">
              <ul className="flex flex-col gap-2">
                {sidebarItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className="flex items-center gap-3 hover:bg-[#003462] px-3 py-2 rounded-md font-medium text-[#003462] hover:text-white text-sm transition-colors"
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

      <div className="flex flex-col flex-1">
        <header className="flex justify-between items-center bg-[#003462] shadow-sm p-4 border-b">
          {isDesktop && (
            <button className="p-2 text-white" onClick={toggleSidebar}>
              {isSidebarOpen ? <ChevronRight size={18} /> : <Menu size={18} />}
            </button>
          )}

          <div className="flex justify-between items-center w-full">
            {isDesktop && (
              <div className="flex items-center bg-white border rounded-md overflow-hidden">
                <input
                  type="text"
                  placeholder="Search"
                  className="px-2 py-1 focus:outline-none w-40 focus:w-64 text-black transition-all duration-300 ease-in-out"
                />
                <button className="bg-[#f0f8ff] px-3 py-1">
                  <Search className="text-[#0c385f]" />
                </button>
              </div>
            )}

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
          <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 w-full overflow-y-auto">
            {children}
          </main>
        </ProtectedRoute>
      </div>
    </div>
  );
};

export default SidebarLayout;
