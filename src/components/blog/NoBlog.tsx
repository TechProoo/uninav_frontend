"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ThemeButton } from "../ui/ThemeButton";
import Image from "next/image";
import Empty from "../../../public/Image/empty.jpg";
import { useRouter } from "next/navigation";

gsap.registerPlugin(useGSAP);

const NoblogPage: React.FC = () => {
  const messageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useGSAP(() => {
    gsap.from(messageRef.current, {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
    });

    gsap.from(imageRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 1.5,
      delay: 0.4,
      ease: "elastic.out(1, 0.75)",
    });
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className=" bg-gradient-to-br from-blue-50 via-white to-purple-100 dark:from-gray-900 dark:to-black text-center">
      <div
        className="glassmorphism p-8 rounded-3xl shadow-2xl backdrop-blur-lg border border-white/20  w-full"
        ref={messageRef}
      >
        <div ref={imageRef} className="mb-6 flex justify-center">
          <Image
            src={Empty}
            alt="No blog illustration"
            className="w-32 md:w-50 rounded-xl shadow-lg ring-2 ring-purple-300 dark:ring-purple-600"
            priority
          />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
          Oops! No Blogs Published Yet
        </h1>

        <p className="mt-4 text-md md:text-lg text-gray-600 dark:text-gray-300">
          You haven’t shared anything with the world yet. Let your voice be
          heard — create your first blog now!
        </p>

        <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
          <ThemeButton
            text="Create Blog"
            onClick={() => handleNavigation("/dashboard/blogs/createblog")}
          />
          <ThemeButton
            text="Explore Blogs"
            onClick={() => handleNavigation("/explore?defaultTab=blogs")}
          />
        </div>
      </div>
    </div>
  );
};

export default NoblogPage;
