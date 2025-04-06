// components/ConditionalNavbar.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

const hiddenRoutes = ["/auth/login", "/auth/signup"];

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const shouldHide = hiddenRoutes.includes(pathname);

  if (shouldHide) return null;
  return <Navbar />;
}
