"use client";

import React, { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { SelectDemo } from "@/components/ui/SelectDrop";
import gsap from "gsap";

defineElement(lottie.loadAnimation);

// Define a type for form data
interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  departmentId: string;
  level: string;
}

const Page = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Type the formData state
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    departmentId: "",
    level: "",
  });

  const [errors, setErrors] = useState<any>({});

  const stepRef = useRef<HTMLDivElement>(null);

  const animateStep = (direction: "next" | "back") => {
    if (!stepRef.current) return;

    const tl = gsap.timeline();

    // Animate out
    tl.to(stepRef.current, {
      x: direction === "next" ? -100 : 100,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setStep((prev) => (direction === "next" ? prev + 1 : prev - 1));
      },
    });
  };

  useEffect(() => {
    if (!stepRef.current) return;

    // Animate in
    gsap.fromTo(
      stepRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.3 }
    );
  }, [step]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Form submitted!");
  };

  const validateStep = () => {
    let currentErrors = {};
    switch (step) {
      case 1:
        if (!formData.firstName)
          currentErrors.firstName = "First name is required";
        if (!formData.lastName)
          currentErrors.lastName = "Last name is required";
        break;
      case 2:
        if (!formData.username) currentErrors.username = "Username is required";
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
          currentErrors.email = "Valid email is required";
        }
        break;
      case 3:
        if (!formData.password) currentErrors.password = "Password is required";
        if (!formData.departmentId)
          currentErrors.departmentId = "Department must be selected";
        if (!formData.level) currentErrors.level = "Level is required";
        break;
      default:
        break;
    }
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleNext = () => {
    if (validateStep()) {
      animateStep("next");
    }
  };

  const handleBack = () => {
    animateStep("back");
  };

  return (
    <div className="login_container">
      <div className="grid grid-cols-12">
        <div className="md:col-span-6 hidden md:block">
          <div className="sticky" style={{ top: "1rem" }}>
            <div className="h-screen">
              <DotLottieReact
                src="https://lottie.host/46eb62cc-bdd9-4919-990b-8189949823e8/qbVdseGSOw.lottie"
                loop
                autoplay
              />
            </div>
          </div>
        </div>
        <div className="md:col-span-6">
          <div className="form_cover mt-10 md:w-10/12 md:p-5 p-2 md:px-10 rounded-lg w-full m-auto">
            <div className="form_head text-center">
              <h1 className="text-4xl text-center fst flex items-center justify-center gap-5">
                Create Your Account
                {/* @ts-ignore */}
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

            {/* Progress Bar */}
            <div className="my-6">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(step / totalSteps) * 100}%` }}
                ></div>
              </div>
              <p className="text-center text-sm font-medium text-gray-600 mt-2">
                Step {step} of {totalSteps}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div ref={stepRef} className="space-y-6 transition-transform">
                {step === 1 && (
                  <>
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 fst mb-1"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="John"
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 fst mb-1"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Doe"
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <div></div>
                      <Button text="Next" onClick={handleNext} type="button" />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 fst mb-1"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="johnd1oe"
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {errors.username && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.username}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 fst mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@example.com"
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <Button text="Back" onClick={handleBack} type="button" />
                      <Button text="Next" onClick={handleNext} type="button" />
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 fst mb-1"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.password}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="departmentId"
                        className="block text-sm font-medium text-gray-700 fst mb-1"
                      >
                        Department
                      </label>
                      <SelectDemo />
                      {errors.departmentId && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.departmentId}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="level"
                        className="block text-sm font-medium text-gray-700 fst mb-1"
                      >
                        Level
                      </label>
                      <input
                        type="number"
                        id="level"
                        value={formData.level}
                        onChange={handleChange}
                        placeholder="300"
                        className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {errors.level && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.level}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <Button text="Back" onClick={handleBack} type="button" />
                      <Button text="Sign Up" type="submit" />
                    </div>
                  </>
                )}
              </div>

              <div className="text-center mt-6">
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

export default Page;
