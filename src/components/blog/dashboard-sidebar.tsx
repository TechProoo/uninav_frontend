import {
  AreaChartIcon,
  BookOpen,
  Bookmark,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Settings,
  User,
  Building2,
  FolderHeart,
  University,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/authContext";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Materials",
    url: "/dashboard/materials",
    icon: BookOpen,
  },
  {
    title: "Courses",
    url: "/dashboard/courses",
    icon: GraduationCap,
  },
  {
    title: "Blogs",
    url: "/dashboard/blogs",
    icon: AreaChartIcon,
  },
  {
    title: "Adverts",
    url: "/dashboard/ads",
    icon: Megaphone,
  },
  {
    title: "Collections",
    url: "/dashboard/collections",
    icon: FolderHeart,
  },
  {
    title: "Bookmarks",
    url: "/dashboard/bookmarks",
    icon: Bookmark,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
];

export function DashboardSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  // Add management item if user is admin
  const sidebarItems = [...items];
  if (user?.role === "admin") {
    sidebarItems.push({
      title: "Site Management",
      url: "/dashboard/management",
      icon: Building2,
    });
  }

  return (
    <Sidebar className="w-64 min-w-[4rem]">
      <SidebarContent className="flex flex-col pt-[7rem] h-full">
        <SidebarMenu className="space-y-1 px-3">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <Link
                  href={item.url}
                  className={cn(
                    "flex items-center space-x-2 p-2 rounded-md",
                    isActive
                      ? "bg-blue-100 text-primar hover:bg-blue-200"
                      : "hover:bg-gray-100"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
