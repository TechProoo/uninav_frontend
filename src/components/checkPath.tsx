// components/ConditionalNavbar.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "../ConditionalNavbar/Navbar";

const hiddenRoutes = [
  "/auth/login",
  "/auth/signup",
  "/dashboard",
  "/dashboard/blogs",
  "/dashboard/blogs/createblog",
  "/dashboard/blogs/viewblog",
  "/allblogs",
  "/allblogs/viewblog",
  "/dashboard/materials",
  "/dashboard/profile",
  "/dashboard/settings",
];

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const shouldHide = hiddenRoutes.includes(pathname);

  if (shouldHide) return null;
  return <Navbar />;
}
