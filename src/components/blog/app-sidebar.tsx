import {
  AreaChartIcon,
  BookOpen,
  Bookmark,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Pencil,
  Settings,
  University,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
// Remove the direct SVG import
// import UniNavLogo from "../../../public/Image/uninav-logo.svg";
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
    title: "Blogs",
    url: "/dashboard/blogs",
    icon: AreaChartIcon,
  },
  {
    title: "Courses",
    url: "/dashboard/courses",
    icon: GraduationCap,
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
    title: "course Map",
    url: "/dashboard/course-map",
    icon: University,
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

export function AppSidebar() {
  return (
    <Sidebar defaultWidth="16rem" collapsedWidth="3rem">
      <SidebarContent className="flex flex-col h-full">
        <div className="relative flex items-center px-3 py-4 h-16">
          <Link
            href="/"
            className="group flex items-center space-x-2 cursor-pointer"
          >
            <Image
              src="/Image/uninav-logo.svg" // Use direct path to the SVG
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
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title} href={item.url}>
              <item.icon className="mr-2 w-4 h-4" />
              <span>{item.title}</span>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
