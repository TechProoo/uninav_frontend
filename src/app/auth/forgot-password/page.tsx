"use client";

import React, { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ButtonSlider } from "@/components/ui/ButtonSlider";
import toast from "react-hot-toast";
import { requestPasswordReset } from "@/api/auth.api";
import Loader from "../login/loading";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeLottie = async () => {
      const lottie = (await import("lottie-web")).default;
      const { defineElement } = await import("@lordicon/element");
      defineElement(lottie.loadAnimation);
    };

    initializeLottie();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      const response = await requestPasswordReset(email);
      toast.success(
        response.message || "Reset instructions sent to your email"
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to send reset instructions");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="login_container">
      <div className="grid grid-cols-12">
        <div className="col-span-12 md:col-span-6 my-auto md:pt-1 h-vh md:h-auto">
          <div className="m-auto p-3 md:p-5 md:px-10 md:rounded-lg w-full md:w-10/12 form_cover">
            <div className="text-center form_head">
              <h1 className="flex justify-center items-center gap-5 text-4xl fst">
                Forgot Password?
                {/* @ts-ignore */}
                <lord-icon
                  src="https://cdn.lordicon.com/alnsmmtf.json"
                  trigger="loop"
                  colors="primary:#121331,secondary:#75bfff"
                  style={{ width: "55px", height: "55px" }}
                  /* @ts-ignore */
                ></lord-icon>
              </h1>
              <p>Enter your email to receive password reset instructions.</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mt-5 w-[100%] md:w-[80%]">
                <div className="md:w-[100%]">
                  <label htmlFor="email" className="fst">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 p-3 rounded-lg w-full"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-center my-5">
                <ButtonSlider type="submit" text="Send Reset Instructions" />
              </div>
            </form>
          </div>
        </div>
        <div className="hidden md:block md:col-span-6">
          <div className="h-screen">
            <DotLottieReact
              src="https://lottie.host/f25fe915-d0e6-4202-9e40-e9720820d548/rbDAzArnxl.lottie"
              loop
              autoplay
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
