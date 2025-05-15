"use client";

import Image from "next/image";
import Bag from "../../public/Image/medium-shot-students-classroom (1).jpg";
import { ButtonSlider } from "@/components/ui/ButtonSlider";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Register plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

export default function Hero() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // Refs for GSAP animations with proper typing
  const heroRef = useRef<HTMLDivElement>(null);
  const topTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const svgRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Initialize svgRefs array
  useEffect(() => {
    svgRefs.current = svgRefs.current.slice(0, 3);
  }, []);

  useEffect(() => {
    if (!headingRef.current) return;

    const tl = gsap.timeline({
      defaults: { ease: "power4.out" },
      scrollTrigger: {
        trigger: heroRef.current,
        start: "top center+=100",
        end: "center center",
      },
    });

    // Create split text instance
    const split = new SplitText(headingRef.current, {
      type: "chars,words",
      charsClass: "char",
      wordsClass: "word",
    });

    // Fade in and slide up the hero container with slight zoom
    tl.fromTo(
      heroRef.current,
      {
        opacity: 0,
        y: 100,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power2.out",
      }
    );

    // Animate top text with SVG with bounce
    tl.fromTo(
      topTextRef.current,
      {
        opacity: 0,
        y: 20,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "back.out(1.2)",
      },
      "-=0.8"
    );

    // Animate heading characters with stagger and bounce
    tl.fromTo(
      split.chars,
      {
        opacity: 0,
        y: 50,
        rotateX: -90,
        transformOrigin: "50% 50% -50",
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 1,
        stagger: {
          amount: 0.8,
          from: "start",
          ease: "power2.out",
        },
        ease: "back.out(1.7)",
      },
      "-=0.4"
    ).to(split.chars, {
      y: -10,
      duration: 0.3,
      stagger: {
        amount: 0.2,
        from: "start",
      },
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });

    // Animate description with fade and slide
    tl.fromTo(
      descriptionRef.current,
      {
        opacity: 0,
        y: 30,
        scale: 0.95,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      "-=1"
    );

    // Animate buttons with stagger - fixed type error
    if (buttonsRef.current) {
      tl.fromTo(
        Array.from(buttonsRef.current.children),
        {
          opacity: 0,
          y: 20,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "back.out(1.2)",
        },
        "-=0.6"
      );
    }

    // Animate main image with zoom and fade
    tl.fromTo(
      imageRef.current,
      {
        opacity: 0,
        scale: 0.8,
        x: 50,
      },
      {
        opacity: 1,
        scale: 1,
        x: 0,
        duration: 1.4,
        ease: "power2.out",
      },
      "-=1.2"
    );

    // Enhanced floating animation for SVGs
    svgRefs.current.forEach((svg, index) => {
      if (!svg) return;

      gsap.to(svg, {
        y: -15,
        rotation: index % 2 === 0 ? 5 : -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: index * 0.3,
      });
    });

    // Enhanced scroll trigger animation for parallax effect
    gsap.to(imageRef.current, {
      scrollTrigger: {
        trigger: imageRef.current,
        start: "top center",
        end: "bottom top",
        scrub: 1,
        toggleActions: "play none none reverse",
      },
      y: 80,
      scale: 1.1,
      rotate: 5,
      ease: "none",
    });

    // Cleanup function
    return () => {
      split.revert();
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  const setSvgRef = (index: number) => (el: HTMLDivElement | null) => {
    if (svgRefs.current) {
      svgRefs.current[index] = el;
    }
  };

  return (
    <div className="relative overflow-hidden hero_container" ref={heroRef}>
      <div className="items-center grid grid-cols-12 m-auto py-8 md:py-16 lg:py-20 w-11/12 md:w-10/12 min-h-[80vh] md:min-h-[70vh]">
        <div className="order-1 md:order-1 col-span-12 md:col-span-6">
          <div className="hero_left">
            <div
              className="hero_left_top flex items-center gap-2"
              ref={topTextRef}
            >
              <div className="w-7" ref={setSvgRef(0)}>
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      fill="#FF6B6B"
                      d="M247.563 19.813c-13.458 0-24.344 10.917-24.344 24.375 0 13.457 10.885 24.343 24.343 24.343 13.457 0 24.375-10.888 24.375-24.343 0-13.454-10.918-24.374-24.375-24.374zm.937 70.312c-4.414 85.037-23.308 149.063-46.156 149.063-5.667 0-11.307-4.22-16.344-11.438 1.29 41.965-4.895 68.787-19.844 67.625-5.412-.42-11.71-4.443-18.125-11.406 20.254 50.4 58.82 84.75 103.376 84.75 44.556 0 83.122-34.35 103.375-84.75-6.413 6.962-12.678 10.985-18.092 11.405-16.276 1.265-22.873-29.93-19.875-78.563-6.6 13.806-14.202 22.375-22.188 22.375-22.85 0-41.71-64.025-46.125-149.062zM104.25 314.53c-51.466 16.677-84.688 41.948-84.688 69.97 0 50.166 104.813 91.096 234.188 91.094 129.375-.002 234.188-40.928 234.188-91.094 0-28.02-33.222-53.293-84.688-69.97 27.147 12.92 43.813 29.24 43.813 47.19 0 41.413-86.506 74.81-193.313 74.81-106.805.002-193.313-33.397-193.313-74.81 0-17.95 16.666-34.273 43.813-47.19zm68.906 13.814c-28.25 9.053-46.72 22.128-46.72 37.437 0 27.24 57.065 49.626 127.314 49.626 70.248 0 127.313-22.386 127.313-49.625 0-15.308-18.468-28.383-46.72-37.436 14.94 7.036 24.532 15.4 24.532 25.22 0 22.485-47.132 40.686-105.125 40.686s-105.125-18.2-105.125-40.688c0-9.818 9.592-18.182 24.53-25.218z"
                    ></path>
                  </g>
                </svg>
              </div>
              <small className="text-sm md:text-base">
                Start Learning Today
              </small>
            </div>
            <div className="hero_left_md relative mt-5">
              <h1
                className="font-bold text-3xl sm:text-4xl md:text-5xl leading-tight perspective-1000"
                ref={headingRef}
              >
                The Ultimate Study Platform for University Students
              </h1>
              <div
                className="top-0 right-10 md:right-20 absolute w-8 md:w-10"
                ref={setSvgRef(1)}
              >
                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      fill="#4ECDC4"
                      d="M135.563 17.5c-16.394-.215-25.532 15.656-25.532 15.656L63 144.562l26 15 72.97-96.406s15.012-26-10.97-41c-5.683-3.28-10.847-4.596-15.438-4.656zm219.656 13.22c-9.124.072-16.47 4.31-16.47 4.31L112.437 183l15 26L368.75 86.97S394.72 71.98 379.72 46c-7.033-12.18-16.452-15.346-24.5-15.28zM16 166v180a90 90 0 0 0 0-180zm435 45l-315 30v30l315 30s45 0 45-45-45-45-45-45zm-323.563 92l-15 26L338.75 476.97s25.97 15.012 40.97-10.97-10.97-40.97-10.97-40.97L127.437 303zM89 352.438l-26 15 47.03 111.406s14.99 25.97 40.97 10.97c25.982-15.002 10.97-40.97 10.97-40.97L89 352.438z"
                    ></path>
                  </g>
                </svg>
              </div>
            </div>
            <div className="hero_left_md_two" ref={descriptionRef}>
              <p className="mt-5 max-w-md text-base md:text-lg">
                {isAuthenticated && user
                  ? `Welcome back, ${user.firstName}! Ready to continue your learning journey?`
                  : "Access, Share & Discover Academic Resources Organized by Faculty, Department, and Course."}
              </p>
            </div>
            <div
              className="hero_left_bottom flex flex-wrap gap-4 mt-8 md:mt-10"
              ref={buttonsRef}
            >
              {isAuthenticated && user ? (
                <>
                  <ButtonSlider
                    onClick={() => navigateTo("/dashboard")}
                    text={"Visit Dashboard"}
                  />
                  <ButtonSlider
                    onClick={() =>
                      navigateTo("/dashboard/materials?action=create")
                    }
                    text={"Upload Material"}
                  />
                </>
              ) : (
                <>
                  <ButtonSlider
                    onClick={() => navigateTo("/auth/login")}
                    text={"Get Started"}
                  />
                  <ButtonSlider
                    text={"Learn More"}
                    onClick={() => navigateTo("/about")}
                  />
                </>
              )}
              <div className="ml-2 w-16 md:w-20" ref={setSvgRef(2)}>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  stroke="#000"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <path
                      opacity="0.5"
                      d="M12 20.0283V18H8L8 20.0283C8 20.3054 8 20.444 8.09485 20.5C8.18971 20.556 8.31943 20.494 8.57888 20.3701L9.82112 19.7766C9.9089 19.7347 9.95279 19.7138 10 19.7138C10.0472 19.7138 10.0911 19.7347 10.1789 19.7767L11.4211 20.3701C11.6806 20.494 11.8103 20.556 11.9051 20.5C12 20.444 12 20.3054 12 20.0283Z"
                      fill="#FFD93D"
                    ></path>{" "}
                    <path
                      d="M8 18H7.42598C6.34236 18 5.96352 18.0057 5.67321 18.0681C5.15982 18.1785 4.71351 18.4151 4.38811 18.7347C4.27837 18.8425 4.22351 18.8964 4.09696 19.2397C3.97041 19.5831 3.99045 19.7288 4.03053 20.02C4.03761 20.0714 4.04522 20.1216 4.05343 20.1706C4.16271 20.8228 4.36259 21.1682 4.66916 21.4142C4.97573 21.6602 5.40616 21.8206 6.21896 21.9083C7.05566 21.9986 8.1646 22 9.75461 22H14.1854C15.7754 22 16.8844 21.9986 17.7211 21.9083C18.5339 21.8206 18.9643 21.6602 19.2709 21.4142C19.5774 21.1682 19.7773 20.8228 19.8866 20.1706C19.9784 19.6228 19.9965 18.9296 20 18H12V20.0283C12 20.3054 12 20.444 11.9051 20.5C11.8103 20.556 11.6806 20.494 11.4211 20.3701L10.1789 19.7767C10.0911 19.7347 10.0472 19.7138 10 19.7138C9.95279 19.7138 9.9089 19.7347 9.82112 19.7766L8.57888 20.3701C8.31943 20.494 8.18971 20.556 8.09485 20.5C8 20.444 8 20.3054 8 20.0283V18Z"
                      fill="#FF9F1C"
                    ></path>{" "}
                    <path
                      opacity="0.5"
                      d="M4.72718 2.73332C5.03258 2.42535 5.46135 2.22456 6.27103 2.11478C7.10452 2.00177 8.2092 2 9.7931 2H14.2069C15.7908 2 16.8955 2.00177 17.729 2.11478C18.5387 2.22456 18.9674 2.42535 19.2728 2.73332C19.5782 3.0413 19.7773 3.47368 19.8862 4.2902C19.9982 5.13073 20 6.24474 20 7.84202L20 18H7.42598C6.34236 18 5.96352 18.0057 5.67321 18.0681C5.15982 18.1785 4.71351 18.4151 4.38811 18.7347C4.27837 18.8425 4.22351 18.8964 4.09696 19.2397C4.02435 19.4367 4 19.5687 4 19.7003V7.84202C4 6.24474 4.00176 5.13073 4.11382 4.2902C4.22268 3.47368 4.42179 3.0413 4.72718 2.73332Z"
                      fill="#FFBF69"
                    ></path>{" "}
                    <path
                      d="M7.25 7C7.25 6.58579 7.58579 6.25 8 6.25H16C16.4142 6.25 16.75 6.58579 16.75 7C16.75 7.41421 16.4142 7.75 16 7.75H8C7.58579 7.75 7.25 7.41421 7.25 7Z"
                      fill="#FF9F1C"
                    ></path>{" "}
                    <path
                      d="M8 9.75C7.58579 9.75 7.25 10.0858 7.25 10.5C7.25 10.9142 7.58579 11.25 8 11.25H13C13.4142 11.25 13.75 10.9142 13.75 10.5C13.75 10.0858 13.4142 9.75 13 9.75H8Z"
                      fill="#FF9F1C"
                    ></path>{" "}
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="order-2 md:order-2 col-span-12 md:col-span-6 mb-8 md:absolute h-screen top-0 right-0 md:mb-0">
          <div
            className="flex justify-center md:justify-end hero_img"
            ref={imageRef}
          >
            <Image
              className="w-4/5 md:w/full md:max-w-none max-w-md hero_img_main"
              src={Bag}
              alt="Person"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
