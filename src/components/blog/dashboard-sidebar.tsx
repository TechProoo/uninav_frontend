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
  SidebarHeader,
} from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/authContext";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

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
    <Sidebar className="w-64 min-w-[4rem]" collapsible="icon">
      <SidebarHeader className="flex items-center justify-center py-4">
        <Link href="/" className="flex items-center justify-center">
          <Image
            src="/Image/uninav-logo.svg"
            alt="UniNav Logo"
            width={isCollapsed ? 32 : 60}
            height={isCollapsed ? 32 : 20}
            className="hover:opacity-80 transition-opacity"
            priority
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex flex-col h-full">
        <SidebarMenu className="space-y-1 px-3">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.url;
            
            // For mobile, always show the text
            // For desktop, show text only when expanded
            const showText = isMobile || !isCollapsed;
            
            return (
              <SidebarMenuItem key={item.title}>
                {isCollapsed ? (
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center justify-center p-2 rounded-md transition-all",
                          isActive
                            ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            : "hover:bg-gray-100"
                        )}
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={10}>
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Link
                    href={item.url}
                    className={cn(
                      "flex items-center space-x-2 p-2 rounded-md transition-all",
                      isActive
                        ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                        : "hover:bg-gray-100"
                    )}
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
