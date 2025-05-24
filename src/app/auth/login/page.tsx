"use client";

import React, { useEffect, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { ButtonSlider } from "@/components/ui/ButtonSlider";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { login } from "@/api/auth.api";
import toast from "react-hot-toast";
import Loader from "./loading";
import { useAuth } from "@/contexts/authContext";
import { fetchUserProfile } from "@/api/user.api";
import { Eye, EyeClosed } from "lucide-react";
import { storeSession } from "@/lib/utils";
import GoogleButton from '@/components/ui/GoogleButton';

const page = () => {
  useEffect(() => {
    const initializeLottie = async () => {
      const lottie = (await import("lottie-web")).default;
      const { defineElement } = await import("@lordicon/element");
      defineElement(lottie.loadAnimation);
    };

    initializeLottie();
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    isAuthenticated,
    needsEmailVerification,
    setAuthTokenAndFetchUser,
  } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // If authenticated but email not verified, the context will handle redirection
      if (!needsEmailVerification()) {
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, needsEmailVerification, redirectTo, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { token, data } = await login(formData);

      toast.success(data.message || "Login successful");
      // Fetch user profile after successful login (email needs to be verified before login else it returns error)
      setAuthTokenAndFetchUser(token).then(() => {
        router.push(redirectTo);
      });

    } catch (error: any) {
      toast.error(error?.message || "Invalid credentials");
      if (error?.message?.toLowerCase().startsWith("email not verified")) {
        router.push(
          `/auth/verify-email?email=${encodeURIComponent(formData.email)}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="login_container pt-16">
      <div className="items-center grid grid-cols-12">
        <div className="col-span-12 md:col-span-6 my-auto md:pt-1 h-vh md:h-auto">
          <div className="m-auto p-3 md:p-5 md:px-10 md:rounded-lg w-full md:w-10/12 form_cover">
            <div className="text-center form_head">
              <h1 className="flex justify-center items-center gap-5 text-4xl fst">
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
            <form onSubmit={handleSubmit}>
              <div className="mt-5 w-[100%] md:w-[80%]">
                <div className="md:w-[100%]">
                  <label htmlFor="email" className="fst">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-2 p-3 rounded-lg w-full"
                    required
                  />
                </div>
              </div>
              <div className="mt-5 w-[100%] md:w-[80%]">
                <label
                  htmlFor="password"
                  className="block mb-2 font-medium text-gray-700 text-sm"
                >
                  Password
                </label>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="p-3 pr-16 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="top-1/2 right-4 absolute focus:outline-none font-medium text-blue-700 hover:underline -translate-y-1/2"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <Eye size={15} /> : <EyeClosed size={15} />}
                  </button>
                </div>
              </div>
              <div className="mt-2">
                <Link
                  href="/auth/forgot-password"
                  className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-300 dark:text-blue-400 fst"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="flex flex-col gap-4 my-5">
                <ButtonSlider type="submit" text="Login" />
                
                <GoogleButton />
              </div>
              <div className="text-center">
                <p>
                  Don't have an account?{" "}
                  <Link href={"/auth/signup"} className="font-black fst">
                    SignUp
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
        <div className="hidden md:block md:col-span-6">
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
