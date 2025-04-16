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
    <div className="flex flex-col justify-center items-center relative text-center noblog-container">
      <div className="flex gap-5 space-y-5 absolute right-0 md:top-[-5%] top-0 right-12">
        <ThemeButton
          text="All Blogs"
          onClick={() => handleNavigation("/explore?defaultTab=blogs")}
        />
        <ThemeButton
          text="Create Blog"
          onClick={() => handleNavigation("/dashboard/blogs/createblog")}
        />
      </div>
      <div ref={imageRef} className="mb-6 noblog-img md:mt-5 mt-20">
        <Image src={Empty} alt="No blog icon" className="rounded-full w-100" />
      </div>
      <div ref={messageRef}>
        <h1 className="font-bold text-gray-800 text-3xl md:text-4xl">
          Oops, no blogs published yet!
        </h1>
        <p className="mt-4 text-gray-600 text-xl">
          It seems like you haven't written any blogs yet. Stay tuned for more
          exciting content!
        </p>
      </div>
    </div>
  );
};

export default NoblogPage;
