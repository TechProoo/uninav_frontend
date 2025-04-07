"use client";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
  Search,
  UploadCloud,
  Group,
  Bell,
  BellIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProtectedRoute from "@/auth/ProtectedRoute";
import { BadgeDemo } from "@/components/ui/BadgeUi";
import { TooltipDemo } from "@/components/ui/TooltipUi";
import { useAuth } from "@/contexts/authContext";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: UploadCloud, label: "Posts", path: "/dashboard/uploadMaterials" },
  { icon: Group, label: "Groups", path: "/dashboard/groups" },
  { icon: Bell, label: "Notifications", path: "/dashboard/notifications" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

interface LayoutProp {
  children: ReactNode;
}

const SidebarLayout: React.FC<LayoutProp> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { logout, isAuthenticated } = useAuth();

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
    if (!sidebar) return;

    gsap.to(sidebar, {
      width: isSidebarOpen ? 260 : 0,
      opacity: isSidebarOpen ? 1 : 0,
      duration: 0.3,
      ease: "power1.inOut",
    });
  }, [isSidebarOpen]);

  const handleLogout = () => {
    logout();
  };

  const user = { username: "JohnDoe", email: "johndoe@example.com" };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`sidebar relative ${
          isSidebarOpen ? "block" : "hidden"
        } md:block h-full border-r overflow-y-auto`}
      >
        {/* Logo */}
        <div className="p-4">
          <Image
            className="w-32 mb-4"
            src="/path/to/logo.png"
            alt="Logo"
            width={120}
            height={40}
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-4">
          <div className="flex flex-col gap-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-[#f0f8ff] hover:bg-[#003462] text-[#003462]`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* User Info + Logout */}
        <div className="p-4 mt-auto border-t">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <button
              className="p-2 rounded-full hover:bg-muted"
              onClick={handleLogout}
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="p-4 dashboard_head border-b flex items-center justify-between">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md md:block hidden"
          >
            {isSidebarOpen ? <ChevronRight size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex justify-between w-full">
            <div className="md:flex hidden items-center border rounded-md overflow-hidden">
              <input
                type="text"
                placeholder="Search"
                className="transition-all dashboard_head_input duration-300 ease-in-out w-54 focus:w-84 focus:outline-none px-2 py-1"
              />
              <button className="text-white bg px-3 py-1 flex items-center justify-center">
                <Search />
              </button>
            </div>
            <div className="flex gap-2 items-center">
              <TooltipDemo
                text={<BellIcon size={15} color="#f0f8ff" />}
                notify="notifications"
              />
              {/* Add more icons or buttons here */}
            </div>
          </div>
        </header>

        {/* Render children (main content) */}

        <ProtectedRoute>
          <main className="flex-1 overflow-y-auto">{children}</main>
        </ProtectedRoute>
      </div>
    </div>
  );
};

export default SidebarLayout;
