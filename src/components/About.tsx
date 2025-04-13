"use client";

import React, { useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Services from "./Services";
import Image from "next/image";
import Logo from "../../public/Image/uninav-logo-image.png";
import Button from "./ui/Button-styled";
import { useRouter } from "next/navigation";

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
  useEffect(() => {
    const initializeLottie = async () => {
      const lottie = (await import("lottie-web")).default;
      const { defineElement } = await import("@lordicon/element");
      defineElement(lottie.loadAnimation);
    };

    initializeLottie();
  }, []);

  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path);
  };
  return (
    <div className="about_bg">
      <div className="m-auto py-1 md:py-10 w-10/12">
        <div className="items-center gap-5 grid grid-cols-12">
          <div className="col-span-12 md:col-span-6">
            <DotLottieReact
              src="https://lottie.host/77c6b78c-2671-41a6-9206-2870569a2fcb/xhS9lOc3bC.lottie"
              loop
              autoplay
            />
            <div className="about_left py-5 md:py-10 border_c md:w-full fst">
              <div className="m-auto w-11/12">
                <h1 className="font-bold text-2xl sm:text-2xl md:text-3xl lg:text-4xl md:text-left text-center">
                  Enhancing Learning, One Resource at a Time
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
              <div className="col-span-12 md:col-span-6">
                <div className="about_right py-4 md:py-6 border_c mdw-full about_first fst">
                  <div className="m-auto w-11/12">
                    <div>
                      {/* @ts-ignore */}
                      <lord-icon
                        src="https://cdn.lordicon.com/xmaezqzk.json"
                        trigger="loop"
                        style={{ width: "32px", height: "32px" }}
                        /* @ts-ignore */
                      ></lord-icon>
                    </div>
                    <h2 className="mb-3 font-semibold md:text-xl text-2xl">
                      Study Material Repository
                    </h2>
                    <p className="text-gray-700 md:text-md dark:text-gray-300 text-base">
                      Access & share lecture notes, textbooks, and past
                      questions by Faculty, Department, and Course.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6">
                <div className="about_right py-4 md:py-6 border_c md:w-full fst">
                  <div className="m-auto w-11/12">
                    <div>
                      {/* @ts-ignore */}
                      <lord-icon
                        src="https://cdn.lordicon.com/jdgfsfzr.json"
                        trigger="hover"
                        style={{ width: "32px", height: "32px" }}
                        /* @ts-ignore */
                      ></lord-icon>
                    </div>
                    <h2 className="mb-3 font-semibold md:text-xl text-2xl">
                      Study Group Recommendations
                    </h2>
                    <p className="text-gray-700 md:text-md dark:text-gray-300 text-base">
                      Get connected with WhatsApp-based study groups tailored to
                      your courses.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6">
                <div className="about_right py-4 md:py-6 border_c md:w-full fst">
                  <div className="m-auto w-11/12">
                    <div>
                      {/* @ts-ignore */}
                      <lord-icon
                        src="https://cdn.lordicon.com/eaegfqtv.json"
                        trigger="hover"
                        style={{ width: "32px", height: "32px" }}
                        /* @ts-ignore */
                      ></lord-icon>
                    </div>
                    <h2 className="mb-3 font-semibold md:text-xl text-2xl">
                      Monetize Your Notes
                    </h2>
                    <p className="text-gray-700 md:text-md dark:text-gray-300 text-base">
                      Earn by sharing premium academic resources with other
                      students.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-6">
                <div className="about_right py-4 md:py-6 border_c md:w-full fst">
                  <div className="m-auto w-11/12">
                    <div>
                      {/* @ts-ignore */}
                      <lord-icon
                        src="https://cdn.lordicon.com/sclmgjsa.json"
                        trigger="hover"
                        style={{ width: "32px", height: "32px" }}
                        /* @ts-ignore */
                      ></lord-icon>
                    </div>
                    <h2 className="mb-3 font-semibold md:text-xl text-2xl">
                      Role-Based Access
                    </h2>
                    <p className="text-gray-700 md:text-md dark:text-gray-300 text-base">
                      Enjoy a secure platform with customized access for
                      students, tutors, and admins.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Services />
        <div className="relative shadow-md mt-10 rounded-lg w-full h-auto md:h-[600px] overflow-hidden">
          {/* Overlay content */}
          <div className="z-10 relative flex flex-col justify-center items-center px-4 md:px-10 py-10 md:py-0 h-full text-center">
            <h1 className="drop-shadow-sm mb-4 md:mb-6 font-extrabold text-[var(--bg-dark)] text-3xl md:text-5xl">
              Enhancing Learning, One Resource at a Time
            </h1>
            <p className="opacity-90 mb-6 md:mb-8 max-w-2xl text-[var(--bg-dark)] text-lg md:text-xl">
              Seamless access to academic resources, study groups, and tools
              that help you grow.
            </p>
            <Button
              onClick={() => navigateTo("/auth/login")}
              text={"Get Started"}
            />
          </div>

          {/* Optional illustration on larger screens */}
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
