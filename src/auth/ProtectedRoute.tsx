// components/ProtectedRoute.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/components/loading";
import { useAuth } from "@/contexts/authContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    const timout = setTimeout(() => {
      if (!loading && !isAuthenticated) {
        router.push("/auth/login");
      }
    }, 5000);
    return () => clearTimeout(timout);
  }, [isAuthenticated, loading, router]);

  if (loading) return <Loader />;

  if (!isAuthenticated) return null;

  return <>{children}</>;
}

// Now i observe the view option in blogs review is redirecting the admin to another page, that's not so user friendly i would like if possible you inject that component into a small modal, try keep it responsive like covering most of the screen for more with, just like the way you implemented modal in review-materials only bigger
