import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Power4, Elastic } from "gsap/all";

gsap.registerPlugin(Power4, Elastic);
import Button from "./Button-styled";
import Image from "next/image";
import Empty from "../../../public/Image/empty.jpg";
import { useRouter } from "next/navigation";

export const metadata = {
  layout: false, // Disable layout here
};

const NoblogPage: React.FC = () => {
  const messageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  useEffect(() => {
    // GSAP animations
    if (messageRef.current && imageRef.current) {
      gsap.from(messageRef.current, {
        ease: Power4.easeOut,
        y: 50,
        duration: 1,
      });
      gsap.from(imageRef.current, {
        opacity: 0,
        // ease: Elastic.easeOut.config(1, 0.75),
        duration: 2,
        delay: 0.5,
        ease: "elastic.out(1, 0.75)",
      });
    }
  }, []);

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
      <div className="md:mt-20 flex gap-10">
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
