import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/Navbar";
import QueryProvider from "@/components/QueryProvider";
import ConditionalNavbar from "@/components/checkPath";

export const metadata: Metadata = {
  title: "Uninav",
  description: "University Platform for Students",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ConditionalNavbar />
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
