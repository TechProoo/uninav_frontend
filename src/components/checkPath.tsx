// components/ConditionalNavbar.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "../ConditionalNavbar/Navbar";

const hiddenRoutes = ["/verify-email"];

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const shouldHide = hiddenRoutes.includes(pathname);

  if (shouldHide) return null;
  return <Navbar />;
}
