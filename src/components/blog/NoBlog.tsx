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
      ease: "power4.out",
      y: 50,
      duration: 1,
    });

    gsap.from(imageRef.current, {
      opacity: 0,
      delay: 0.5,
      duration: 2,
      ease: "elastic.out(1, 0.75)",
    });
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-col items-center min-h-screen px-4 text-center">

      {/* Image with animation */}
      <div ref={imageRef} className="mb-6">
        <Image
          src={Empty}
          alt="No blog icon"
          className="w-32 md:w-40 rounded-full shadow-md"
        />
      </div>

      {/* Message and CTA */}
      <div ref={messageRef} className="max-w-xl">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-100">
          Oops! No blogs published yet.
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          It looks like you haven’t shared any blogs so far. Start creating and
          inspire others!
        </p>

        <div className="mt-6">
          <ThemeButton
            text="Create Blog"
            onClick={() => handleNavigation("/dashboard/blogs/createblog")}
          />
        </div>

        <p className="mt-6 text-base text-gray-600 dark:text-gray-400">
          Meanwhile, feel free to explore blogs from other creators.
        </p>

        <div className="mt-4">
          <ThemeButton
            text="All Blogs"
            onClick={() => handleNavigation("/explore?defaultTab=blogs")}
          />
        </div>
      </div>
    </div>
  );
};

export default NoblogPage;
