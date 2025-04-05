"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
import Button from "@/components/ui/Button";
import Link from "next/link";

defineElement(lottie.loadAnimation);

const page = () => {
  return (
    <div className="login_container">
      <div className="grid grid-cols-12">
        <div className="md:col-span-6 hidden md:block">
          <div className="sticky" style={{top:"1rem"}}>
            <div className="h-screen ">
              <DotLottieReact
                src="https://lottie.host/46eb62cc-bdd9-4919-990b-8189949823e8/qbVdseGSOw.lottie"
                loop
                autoplay
              />
            </div>
          </div>
        </div>
        <div className="md:col-span-6">
          <div className="form_cover md:w-10/12 md:p-5 p-2 md:px-10 rounded-lg w-full m-auto">
            <div className="form_head text-center">
              <h1 className="text-4xl text-center fst flex items-center justify-center gap-5">
                Create Your Account {/* @ts-ignore */}
                <lord-icon
                  src="https://cdn.lordicon.com/ncmnezgk.json"
                  trigger="loop"
                  colors="primary:#121331,secondary:#66d7ee"
                  style={{ width: "55px", height: "55px" }}
                  /* @ts-ignore */
                ></lord-icon>
              </h1>
              <p>
                Join Uninav to share and explore academic content across
                faculties and departments.
              </p>
            </div>
            <form className="space-y-6">
              <div className="w-full">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 fst mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  placeholder="John"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 fst mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  placeholder="Doe"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 fst mb-1"
                >
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  placeholder="johnd1oe"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 fst mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="example@example.com"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 fst mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="departmentId"
                  className="block text-sm font-medium text-gray-700 fst mb-1"
                >
                  Department ID
                </label>
                <input
                  type="text"
                  id="departmentId"
                  placeholder="ec105527-013e-49fa-ac2c-71afe85946a6"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="level"
                  className="block text-sm font-medium text-gray-700 fst mb-1"
                >
                  Level
                </label>
                <input
                  type="number"
                  id="level"
                  placeholder="300"
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-center">
                <Button text="Sign Up" />
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="fst font-bold text-blue-600 hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
