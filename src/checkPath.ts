"use client";

import { usePathname } from "next/navigation";
const pathname = usePathname();

const hiddenNavbarRoutes = ["/auth/login", "/auth/signup"];

export const shouldHideNavbar = hiddenNavbarRoutes.includes(pathname);
