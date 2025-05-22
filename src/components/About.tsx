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
    const textElements = document.querySelectorAll(".text-replace-animation");
    const tl = gsap.timeline({ repeat: -1 });

    textElements.forEach((text, i) => {
      if (i === 0) {
        tl.from(text, {
          yPercent: 100,
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      }

      tl.to(text, {
        yPercent: -100,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        delay: 0.5,
      });

      if (i < textElements.length - 1) {
        tl.fromTo(
          textElements[i + 1],
          {
            yPercent: 100,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          "<0.5"
        );
      } else {
        tl.fromTo(
          textElements[0],
          {
            yPercent: 100,
            opacity: 0,
          },
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.out",
          },
          "<0.5"
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
    <div className="relative bg-gradient-to-b from-blue-50 to-white py-16 md:py-24" ref={containerRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Main Section */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-24 mb-24">
          {/* Left Column */}
          <div className="w-full md:w-1/2 flex flex-col justify-center">
            <h2 className="text-sm sm:text-base font-semibold text-blue-600 mb-4 uppercase tracking-wider">About UniNav</h2>
            <h1 
              ref={heroTextRef} 
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#003666] mb-6"
            >
              Enhancing Learning, One Resource at a Time
            </h1>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Transforming the way students connect, learn, and grow through
              seamless access to academic resources and collaborative tools.
            </p>
            <ButtonSlider
              onClick={() => navigateTo("/auth/login")}
              text="Join Our Community"
            />
          </div>

          {/* Right Column - Animation */}
          <div className="w-full md:w-1/2 flex items-center justify-center">
            <div className="w-full max-w-md">
              <DotLottieReact
                src="https://lottie.host/77c6b78c-2671-41a6-9206-2870569a2fcb/xhS9lOc3bC.lottie"
                loop
                autoplay
              />
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mb-24">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 text-[#003666]">
            What Makes UniNav Special
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              {
                icon: "https://cdn.lordicon.com/xmaezqzk.json",
                iconColor: "primary:#003666,secondary:#75bfff",
                title: "Study Material Repository",
                description:
                  "Access & share lecture notes, textbooks, and past questions by Faculty, Department, and Course.",
              },
              {
                icon: "https://cdn.lordicon.com/hpxruznz.json",
                iconColor: "primary:#003666,secondary:#75bfff",
                title: "Collaborative Learning",
                description:
                  "Join study groups, share insights, and collaborate with peers across different departments.",
              },
              {
                icon: "https://cdn.lordicon.com/rxufjlal.json",
                iconColor: "primary:#003666,secondary:#75bfff",
                title: "Smart Organization",
                description:
                  "Organize your academic resources with our intelligent categorization and search system.",
              },
              {
                icon: "https://cdn.lordicon.com/dmqskzxk.json",
                iconColor: "primary:#003666,secondary:#75bfff",
                title: "Knowledge Exchange",
                description:
                  "Share your academic insights and benefit from peer contributions in our learning community.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="feature-card"
                ref={(el) => {
                  if (cardsRef.current) {
                    cardsRef.current[index] = el;
                  }
                }}
              >
                <div className="bg-white rounded-xl shadow-lg p-6 h-full border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      {/* @ts-ignore */}
                      <lord-icon
                        src={item.icon}
                        trigger="hover"
                        colors={item.iconColor}
                        style={{ width: "40px", height: "40px" }}
                        /* @ts-ignore */
                      ></lord-icon>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#003666]">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Text replace animation section */}
        <div className="py-16 flex flex-col items-center justify-center bg-blue-50 rounded-2xl mb-24 px-4">
          <div className="relative h-[60px] md:h-[80px] overflow-hidden text-center w-full">
            <h2 className="text-3xl md:text-4xl font-bold inline-flex justify-center w-full text-[#003666]">
              UniNav is{" "}
              <span className="relative inline-flex justify-center min-w-[200px] md:min-w-[300px] ml-2 text-2xl md:text-3xl">
                <span className="text-replace-animation absolute text-blue-600">
                  community-driven
                </span>
                <span className="text-replace-animation absolute text-blue-600">
                  structured
                </span>
                <span className="text-replace-animation absolute text-blue-600">
                  essential
                </span>
                <span className="text-replace-animation absolute text-blue-600">
                  what you need
                </span>
              </span>
            </h2>
          </div>
          <p className="mt-8 text-gray-700 text-lg max-w-2xl text-center">
            Discover a new way of learning and sharing academic resources that empowers your academic journey
          </p>
        </div>

        {/* Bottom CTA section */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#003666] to-[#0066b3] shadow-lg about_bottom">
          <div className="absolute inset-0 bg-pattern opacity-10"></div>
          <div className="z-10 relative flex flex-col justify-center items-center px-6 py-16 sm:py-20 h-full text-center">
            <h1
              ref={bottomHeadingRef}
              className="text-white mb-6 font-bold text-3xl md:text-4xl lg:text-5xl"
            >
              Ready to Transform Your Learning Experience?
            </h1>
            <p className="opacity-90 mb-8 max-w-2xl text-blue-100 text-lg">
              Join thousands of students who are already benefiting from our platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <ButtonSlider
                onClick={() => navigateTo("/auth/signup")}
                text={"Get Started"}
                className="bg-white text-[#003666] hover:bg-blue-50"
              />
              <ButtonSlider
                onClick={() => navigateTo("/explore")}
                text={"Explore Resources"}
                className="bg-transparent border border-white text-white hover:bg-white/10"
              />
            </div>
          </div>

          <div className="hidden md:block absolute right-0 bottom-0 w-[300px] opacity-80">
            <Image
              src={Logo}
              alt="UniNav Logo"
              className="object-contain"
              width={300}
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
