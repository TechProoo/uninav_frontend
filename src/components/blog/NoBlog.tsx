"use client";
import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import Button from "./Button-styled";
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
    <div className="flex flex-col justify-center items-center p-8 min-h-screen text-center noblog-container">
      <div ref={imageRef} className="mb-6 noblog-img">
        <Image src={Empty} alt="No blog icon" className="rounded-full w-100" />
      </div>
      <div ref={messageRef}>
        <h1 className="font-bold text-gray-800 text-4xl">
          Oops, no blogs published yet!
        </h1>
        <p className="mt-4 text-gray-600 text-xl">
          It seems like you haven't written any blogs yet. Stay tuned for more
          exciting content!
        </p>
      </div>
      <div className="md:flex gap-10 md:space-y-5 mt-3 md:mt-5">
        <Button
          text="All Blogs"
          onClick={() => handleNavigation("/explore?defaultTab=blogs")}
        />
        <Button
          text="Create Blog"
          onClick={() => handleNavigation("/dashboard/blogs/createblog")}
        />
      </div>
    </div>
  );
};

export default NoblogPage;
