"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/blog/app-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    // <SidebarProvider>
    //   <AppSidebar />
    <main className="p-3 w-full">
      {/* <SidebarTrigger
          style={{ color: "black" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "black")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "black")}
        /> */}
      {children}
    </main>
    // </SidebarProvider>
  );
}
