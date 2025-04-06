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
      <div className="grid grid-cols-12 items-center">
        <div className="md:col-span-6">
          <div className="form_cover md:w-10/12 md:p-5 p-3 md:px-10 rounded-lg w-full m-auto">
            <div className="form_head text-center">
              <h1 className="text-4xl fst flex items-center justify-center  gap-5">
                Welcome Back {/* @ts-ignore */}
                <lord-icon
                  src="https://cdn.lordicon.com/jectmwqf.json"
                  trigger="loop"
                  colors="primary:#121331,secondary:#75bfff"
                  style={{ width: "55px", height: "55px" }}
                  /* @ts-ignore */
                ></lord-icon>
              </h1>
              <p>Your gateway to academic resources, study groups, and more.</p>
            </div>
            <form>
              <div className="flex md:w-[80%] overflow-hidden mt-5">
                <div className="md:w-[100%]">
                  <label htmlFor="email" className="fst">
                    Email
                  </label>
                  <input
                    type="email"
                    className="p-3 rounded-lg mt-2 w-full"
                    required
                  />
                </div>
              </div>
              <div className="mt-5 w-[80%]">
                <label
                  htmlFor="pass"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="pass"
                  className="w-full rounded-md p-3"
                />
              </div>
              <div className="mt-2">
                <p className="forgot_password fst">Forgot Password?</p>
              </div>
              <div className="flex justify-center my-5 ">
                <Button text="Login" />
              </div>
              <div className="text-center">
                <p>
                  Don't have an account?{" "}
                  <Link href={"/auth/signup"} className="fst font-black">
                    SignUp
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        <div className="md:col-span-6 hidden md:block">
          <div className="h-screen">
            <DotLottieReact
              src="https://lottie.host/c0771ae5-7778-4033-a945-a3b1c93b2bc6/xmSvWR3ayG.lottie"
              loop
              autoplay
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
