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
    <div className="noblog-container min-h-screen flex flex-col justify-center items-center text-center p-8">
      <div ref={imageRef} className="noblog-img mb-6">
        <Image src={Empty} alt="No blog icon" className="rounded-full w-100" />
      </div>
      <div ref={messageRef}>
        <h1 className="text-4xl font-bold text-gray-800">
          Oops, no blogs published yet!
        </h1>
        <p className="text-xl text-gray-600 mt-4">
          It seems like you haven't written any blogs yet. Stay tuned for more
          exciting content!
        </p>
      </div>
      <div className="md:mt-5 mt-3 md:flex md:space-y-5 gap-10">
        <Button
          text="All Blogs"
          onClick={() => handleNavigation("/allblogs")}
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
