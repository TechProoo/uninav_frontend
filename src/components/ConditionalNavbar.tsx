// components/ConditionalNavbar.tsx
"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation/Navigation";

const hiddenRoutes = ["/verify-email", "/dashboard"];

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const shouldHide = hiddenRoutes.some(route => 
    pathname === route || (route === "/dashboard" && pathname?.startsWith("/dashboard"))
  );

  if (shouldHide) return null;
  return (
      <Navigation />
  );
}
