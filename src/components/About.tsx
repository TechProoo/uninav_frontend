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
      <div className="w-10/12 m-auto py-10">
        <div className="grid grid-cols-12 gap-5 items-center">
          <div className="md:col-span-6">
            <DotLottieReact
              src="https://lottie.host/77c6b78c-2671-41a6-9206-2870569a2fcb/xhS9lOc3bC.lottie"
              loop
              autoplay
            />
            <div className="border_c fst md:w-full md:py-10 py-5 about_left">
              <div className="w-11/12 m-auto">
                <h1 className="md:text-4xl text-3xl">
                  Enhancing Learning, One Resource at a Time
                </h1>
                <p className="mt-3">
                  Transforming the way students connect, learn, and grow through
                  seamless access to academic resources and collaborative tools.
                </p>
              </div>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-6">
                <div className="border_c about_first fst md:w-full md:py-5 py-3 about_right">
                  <div className="w-11/12 m-auto">
                    <div>
                      {/* @ts-ignore */}
                      <lord-icon
                        src="https://cdn.lordicon.com/xmaezqzk.json"
                        trigger="loop"
                        style={{ width: "25px", height: "25px" }}
                        /* @ts-ignore */
                      ></lord-icon>
                    </div>
                    <h1 className="text-2xl">Study Material Repository</h1>
                    <p className="mt-3">
                      Access & share lecture notes, textbooks, and past
                      questions by Faculty, Department, and Course.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-span-6">
                <div className="border_c fst md:w-full md:py-5 py-3 about_right">
                  <div className="w-11/12 m-auto">
                    <div>
                      {/* @ts-ignore */}
                      <lord-icon
                        src="https://cdn.lordicon.com/jdgfsfzr.json"
                        trigger="hover"
                        style={{ width: "25px", height: "25px" }}
                        /* @ts-ignore */
                      ></lord-icon>
                    </div>
                    <h1 className="text-2xl">Study Group Recommendations</h1>
                    <p className="mt-3">
                      Get connected with WhatsApp-based study groups tailored to
                      your courses.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-span-6">
                <div className="border_c fst md:w-full md:py-5 py-3 about_right">
                  <div className="w-11/12 m-auto">
                    <div>
                      {/* @ts-ignore */}
                      <lord-icon
                        src="https://cdn.lordicon.com/eaegfqtv.json"
                        trigger="hover"
                        style={{ width: "25px", height: "25px" }}
                        /* @ts-ignore */
                      ></lord-icon>
                    </div>
                    <h1 className="text-2xl"> Monetize Your Notes</h1>
                    <p className="mt-3">
                      Earn by sharing premium academic resources with other
                      students.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-span-6">
                <div className="border_c fst md:w-full md:py-5 py-3 about_right">
                  <div className="w-11/12 m-auto">
                    <div>
                      {/* @ts-ignore */}
                      <lord-icon
                        src="https://cdn.lordicon.com/sclmgjsa.json"
                        trigger="hover"
                        style={{ width: "25px", height: "25px" }}
                        /* @ts-ignore */
                      ></lord-icon>
                    </div>
                    <h1 className="text-2xl">Role-Based Access</h1>
                    <p className="mt-3">
                      Enjoy a secure platform with customized access for
                      students, tutors, and admins.
                    </p>
                  </div>
                </div>
              </div>

              {/* Add more lord-icon features here in other col-span-6 blocks if needed */}
            </div>
          </div>
        </div>
      </div>
      <div className="about_img"></div>
    </div>
  );
};

export default About;
