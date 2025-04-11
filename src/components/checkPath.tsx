// components/ConditionalNavbar.tsx
"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation/Navigation";

const hiddenRoutes = ["/verify-email"];

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const shouldHide = hiddenRoutes.includes(pathname);

  if (shouldHide) return null;
  return <Navigation />;
}
