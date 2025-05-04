"use client";

import QueryProvider from "@/tanstack/QueryProvider";
import { AuthProvider } from "@/contexts/authContext";
import { BookmarksProvider } from "@/contexts/bookmarksContext";
import ConditionalNavbar from "@/components/ConditionalNavbar";
import { Toaster } from "react-hot-toast";

export default function Template({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <AuthProvider>
        <ConditionalNavbar />
        <BookmarksProvider>{children}</BookmarksProvider>
      </AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
    </QueryProvider>
  );
}
