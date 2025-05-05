"use client";

import React, { Suspense, useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ButtonSlider } from "@/components/ui/ButtonSlider";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { resetPassword } from "@/api/auth.api";
import Loader from "../login/loading";

// Component that uses useSearchParams
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token"); // decoded automatically by Next.js;

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link");
      router.push("/auth/login");
    }
  }, [token, router]);

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
    if (!token) {
      toast.error("Invalid reset link");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword(token, password);
      toast.success(response.message || "Password reset successful");
      router.push("/auth/login");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to reset password");
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
                Reset Password
                {/* @ts-ignore */}
                <lord-icon
                  src="https://cdn.lordicon.com/bpqgkprn.json"
                  trigger="loop"
                  colors="primary:#121331,secondary:#75bfff"
                  style={{ width: "55px", height: "55px" }}
                  /* @ts-ignore */
                ></lord-icon>
              </h1>
              <p>Enter your new password</p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mt-5 w-[100%] md:w-[80%]">
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block mb-2 font-medium text-gray-700 text-sm"
                  >
                    New Password
                  </label>
                  <div className="flex flex-start items-center gap-4">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="p-3 rounded-md w-[85%]"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#003666]"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block mb-2 font-medium text-gray-700 text-sm"
                  >
                    Confirm Password
                  </label>
                  <div className="flex flex-start items-center gap-4">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="p-3 rounded-md w-[85%]"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center my-5">
                <ButtonSlider type="submit" text="Reset Password" />
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
}

// Main component with Suspense boundary for useSearchParams
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
