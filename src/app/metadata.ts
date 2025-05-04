import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://uninav.live"),
  title: "UniNav - Your Gateway to Academic Excellence",
  description:
    "A collaborative university study materials platform that allows students to upload, share, and access course-related materials organized by faculty and department.",
  icons: {
    icon: "/Image/uninav-logo.ico",
  },
  openGraph: {
    title: "UniNav - Your Gateway to Academic Excellence",
    description:
      "Access and share university study materials, organized by faculty and department. Join our academic community today!",
    images: [
      {
        url: "/Image/interface.jpg",
        width: 1200,
        height: 630,
        alt: "UniNav Interface Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "UniNav - Your Gateway to Academic Excellence",
    description:
      "Access and share university study materials, organized by faculty and department. Join our academic community today!",
    images: ["/Image/interface.jpg"],
  },
};
