"use client";

import React from "react";
import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

// define "lord-icon" custom element with default properties
defineElement(lottie.loadAnimation);

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
                <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl">
                  Enhancing Learning, One Resource at a Time
                </h1>
                <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg md:text-xl lg:text-2xl">
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
                    <h2 className="mb-3 font-semibold text-2xl md:text-3xl">
                      Study Material Repository
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg">
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
                    <h2 className="mb-3 font-semibold text-2xl md:text-3xl">
                      Study Group Recommendations
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg">
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
                    <h2 className="mb-3 font-semibold text-2xl md:text-3xl">
                      Monetize Your Notes
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg">
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
                    <h2 className="mb-3 font-semibold text-2xl md:text-3xl">
                      Role-Based Access
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg">
                      Enjoy a secure platform with customized access for
                      students, tutors, and admins.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[100%] md:h-[700px] about_img"></div>
    </div>
  );
};

export default About;
