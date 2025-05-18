"use client";

import React, { useEffect, useRef } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";
import Logo from "../../public/Image/uninav-logo-image.png";
import { ButtonSlider } from "./ui/ButtonSlider";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "lord-icon": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const bottomHeadingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Initialize cardsRef array with null values
    cardsRef.current = cardsRef.current.slice(0, 4);

    const initializeLottie = async () => {
      const lottie = (await import("lottie-web")).default;
      const { defineElement } = await import("@lordicon/element");
      defineElement(lottie.loadAnimation);
    };

    initializeLottie();

    // Text replacement animation
    const textElements = gsap.utils.toArray(".text-replace-animation");
    const tl = gsap.timeline({ repeat: -1 });

    textElements.forEach((text, i) => {
      if (i === 0) {
        tl.from(text as Element, {
          yPercent: 100,
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
        });
      }

      tl.to(text as Element, {
        yPercent: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power2.in",
        delay: 2,
      });

      if (i < textElements.length - 1) {
        tl.fromTo(
          textElements[i + 1] as Element,
          {
            yPercent: 100,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "<0.8"
        );
      } else {
        tl.fromTo(
          textElements[0] as Element,
          {
            yPercent: 100,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "<0.8"
        );
      }
    });

    // Hero text animation
    if (heroTextRef.current) {
      const splitText = new SplitText(heroTextRef.current, {
        type: "words,chars",
      });
      gsap.from(splitText.chars, {
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.02,
        ease: "back.out",
      });
    }

    // Bottom heading text animation
    if (bottomHeadingRef.current) {
      const splitText = new SplitText(bottomHeadingRef.current, {
        type: "words,chars",
      });
      gsap.from(splitText.chars, {
        scrollTrigger: {
          trigger: bottomHeadingRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 50,
        duration: 1,
        stagger: 0.02,
        ease: "back.out",
      });
    }

    // Cards animation
    cardsRef.current.forEach((card, index) => {
      if (card) {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            toggleActions: "play none none reverse",
          },
          opacity: 0,
          y: 50,
          duration: 0.8,
          delay: index * 0.2,
          ease: "power2.out",
        });
      }
    });

    // Bottom section animation
    gsap.from(".about_bottom", {
      scrollTrigger: {
        trigger: ".about_bottom",
        start: "top bottom-=100",
        toggleActions: "play none none reverse",
      },
      opacity: 0,
      y: 100,
      duration: 1,
      ease: "power2.out",
    });
  }, []);

  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="about_bg relative" ref={containerRef}>
      <div className="m-auto py-1 md:py-6 w-10/12">
        <div className="items-center gap-3 grid grid-cols-12">
          <div className="col-span-12 md:col-span-6">
            <DotLottieReact
              src="https://lottie.host/77c6b78c-2671-41a6-9206-2870569a2fcb/xhS9lOc3bC.lottie"
              loop
              autoplay
            />
            <div
              className="about_left py-3 md:py-6 border_c md:w/full fst"
              ref={textRef}
            >
              <div className="m-auto w-11/12">
                <h1
                  ref={heroTextRef}
                  className="font-bold text-2xl sm:text-2xl md:text-3xl lg:text-4xl md:text-left text-center"
                >
                  Enhancing Academic Experience
                </h1>
                <p className="mt-4 text-gray-700 text-md dark:text-gray-300 md:text-xl">
                  Transforming the way students connect, learn, and grow through
                  seamless access to academic resources and collaborative tools.
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="gap-5 grid grid-cols-12">
              {[
                {
                  icon: "https://cdn.lordicon.com/xmaezqzk.json",
                  title: "Study Material Repository",
                  description:
                    "Access & share lecture notes, textbooks, and past questions by Faculty, Department, and Course.",
                },
                {
                  icon: "https://cdn.lordicon.com/hpxruznz.json",
                  title: "Collaborative Learning",
                  description:
                    "Join study groups, share insights, and collaborate with peers across different departments.",
                },
                {
                  icon: "https://cdn.lordicon.com/rxufjlal.json",
                  title: "Smart Organization",
                  description:
                    "Organize your academic resources with our intelligent categorization and search system.",
                },
                {
                  icon: "https://cdn.lordicon.com/dmqskzxk.json",
                  title: "Knowledge Exchange",
                  description:
                    "Share your academic insights and benefit from peer contributions in our learning community.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="col-span-12 md:col-span-6"
                  ref={(el) => {
                    cardsRef.current[index] = el;
                  }}
                >
                  <div className="about_right py-3 md:py-4 border_c mdw-full about_first fst hover:scale-105 transition-transform duration-300">
                    <div className="m-auto w-11/12">
                      <div>
                        {/* @ts-ignore */}
                        <lord-icon
                          src={item.icon}
                          trigger="loop"
                          style={{ width: "32px", height: "32px" }}
                          /* @ts-ignore */
                        ></lord-icon>
                      </div>
                      <h2 className="mb-3 font-semibold md:text-xl text-2xl">
                        {item.title}
                      </h2>
                      <p className="font-medium text-black md:text-md dark:text-white text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Text replace animation section */}
        <div className="py-12 flex flex-col items-center justify-center">
          <div className="relative h-[50px] md:h-[70px] overflow-hidden text-center w-full">
            <h2 className="text-3xl md:text-5xl font-bold inline-flex justify-center w-full">
              UniNav is{" "}
              <span className="relative inline-flex justify-center min-w-[200px] md:min-w-[300px] ml-2">
                <span className="text-replace-animation absolute">
                  innovative
                </span>
                <span className="text-replace-animation absolute">
                  collaborative
                </span>
                <span className="text-replace-animation absolute">
                  transformative
                </span>
                <span className="text-replace-animation absolute">
                  empowering
                </span>
              </span>
            </h2>
          </div>
          <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg max-w-2xl text-center">
            Discover a new way of learning and sharing academic resources
          </p>
        </div>

        <div className="relative shadow-md mt-8 rounded-lg w-full h-auto md:h-[550px] overflow-hidden about_bottom">
          <div className="z-10 relative flex flex-col justify-center items-center px-4 md:px-8 py-8 md:py-0 h-full text-center">
            <h1
              ref={bottomHeadingRef}
              className="drop-shadow-sm mb-3 md:mb-4 font-extrabold text-[var(--bg-dark)] text-3xl md:text-5xl"
            >
              Enhancing Academic Experience
            </h1>
            <p className="opacity-90 mb-4 md:mb-6 max-w-2xl text-[var(--bg-dark)] text-lg md:text-xl">
              Seamless access to academic resources, study groups, and tools
              that help you grow.
            </p>
            <ButtonSlider
              onClick={() => navigateTo("/auth/signup")}
              text={"Get Started"}
            />
          </div>

          <div className="hidden md:block right-0 bottom-0 absolute opacity-90 w-[220px] md:w-[280px]">
            <Image
              src={Logo}
              alt="Study Illustration"
              className="object-contain"
              width={280}
              height={280}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
