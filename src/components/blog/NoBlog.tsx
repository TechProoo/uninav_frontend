import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Button from "./Button-styled";
import Image from "next/image";
import Empty from "../../../public/Image/empty.jpg";

export const metadata = {
    layout: false, // Disable layout here
  };

const NoblogPage: React.FC = () => {
  const messageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP animations
    if (messageRef.current && imageRef.current) {
      gsap.from(messageRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power4.out",
      });
      gsap.from(imageRef.current, {
        opacity: 0,
        rotation: 360,
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
      <div className="mt-10">
        <Button text="Create Blog " />
      </div>
    </div>
  );
};

export default NoblogPage;
