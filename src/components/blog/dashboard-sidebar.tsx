import {
  AreaChartIcon,
  BookOpen,
  Bookmark,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Settings,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";

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
    title: "Advertise",
    url: "/dashboard/advertise",
    icon: Megaphone,
  },
  {
    title: "Bookmarks",
    url: "/dashboard/bookmarks",
    icon: Bookmark,
  },
  {
    title: "Account",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  return (
    <Sidebar defaultWidth="16rem" collapsedWidth="4rem">
      <SidebarContent className="flex flex-col h-full">
        <div className="relative flex items-center px-3 py-4 h-16">
          <Link
            href="/"
            className="group flex items-center space-x-2 cursor-pointer"
          >
            <Image
              src="/Image/uninav-logo.svg"
              alt="UniNav Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <span className="ml-2 font-bold text-primary dark:text-white text-xl">
              UniNav
            </span>
          </Link>
        </div>
        <SidebarMenu className="space-y-1 px-3">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <Link
                href={item.url}
                className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-md"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
