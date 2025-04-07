// components/ProtectedRoute.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/loading";
import Cookies from "js-cookie";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = Cookies.get("uninav_");

    if (!token) {
      router.push("/auth/login");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) return <Loader />;

  return <>{children}</>;
}
