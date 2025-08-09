import { Inter } from "next/font/google";
import "./globals.css";
import { metadata } from "./metadata";
// test
import "@/styles/dialog-fixes.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        src="/nutrient-viewer/nutrient-viewer.js"
        strategy="beforeInteractive"
      />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
