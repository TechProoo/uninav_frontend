"use client";

import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  params: { id: string };
};

const dummyCourses = [
  { id: 1, name: "Introduction to Computer Science", code: "CSC101" },
  { id: 2, name: "Data Structures & Algorithms", code: "CSC201" },
  { id: 3, name: "Computer Architecture", code: "CSC202" },
  { id: 4, name: "Operating Systems", code: "CSC301" },
  { id: 5, name: "Database Systems", code: "CSC302" },
  { id: 6, name: "Computer Networks", code: "CSC303" },
  { id: 7, name: "Software Engineering", code: "CSC304" },
  { id: 8, name: "Artificial Intelligence", code: "CSC401" },
];

export default function DepartmentPage({ params }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const racesRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  // simulate load
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  useGSAP(() => {
    const wrapper = wrapperRef.current;
    const races = racesRef.current;
    if (!wrapper || !races) return;

    // Calculate the scroll amount for horizontal scrolling
    function getScrollAmount() {
      return -(races.scrollWidth - wrapper.clientWidth); // Adjust based on the width of the container
    }

    // GSAP tween animation for scrolling
    const tween = gsap.to(races, {
      x: getScrollAmount,
      ease: "none",
      duration: 1,
    });

    // ScrollTrigger setup for pinning the scroll container
    ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: () => `+=${races.scrollWidth}`,
      pin: true,
      scrub: 1,
      animation: tween,
      invalidateOnRefresh: true,
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      tween.kill();
    };
  }, []);

  return (
    <div className="overflow-x-hidden">
      <div className="h-[50vh] bg-gray-800" /> {/* Top spacer */}
      <div
        ref={wrapperRef}
        className="racesWrapper h-screen relative overflow-hidden bg-bgMain text-white"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <span>Loading Courses...</span>
          </div>
        ) : (
          <div
            ref={racesRef}
            className="races flex no-wrap whitespace-nowrap will-change-transform px-6 py-10"
          >
            {dummyCourses.map((c) => (
              <h2
                key={c.id}
                className="flex-shrink-0 text-[20vw] font-bold px-4"
              >
                {c.code}
              </h2>
            ))}
          </div>
        )}
      </div>
      <div className="h-[100vh] bg-gray-900 px-6 py-10 text-white">
        <h2 className="text-3xl mb-4">About the Department</h2>
        <p>
          Once you’ve scrolled through all courses, the pin releases and you
          continue down to this vertical content.
        </p>
      </div>
    </div>
  );
}
