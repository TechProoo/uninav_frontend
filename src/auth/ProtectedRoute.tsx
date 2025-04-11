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
    const timeout = setTimeout(() => {
      if (!loading && !isAuthenticated) {
        router.push("/auth/login");
      }
    }, 10000);
    return () => clearTimeout(timeout);
  }, [isAuthenticated, loading, router]);

  if (loading) return <Loader />;

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
