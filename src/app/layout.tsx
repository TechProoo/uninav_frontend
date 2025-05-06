import { Inter } from "next/font/google";
import "./globals.css";
import { metadata } from "./metadata";
import "@/styles/dialog-fixes.css";

const inter = Inter({ subsets: ["latin"] });

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
