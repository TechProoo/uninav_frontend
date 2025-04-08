"use client";

import React, { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
import Button from "@/components/ui/Button-styled";
import { SelectDemo } from "@/components/ui/SelectDrop";
import gsap from "gsap";
import { useQuery } from "@tanstack/react-query";
import { getAllFaculty } from "@/api/department.api";
import Loader from "./loading";
import { signup } from "@/api/student-signup.api";
import { FormData } from "@/lib/types/data.type";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/contexts/authContext";
import toast from "react-hot-toast";

defineElement(lottie.loadAnimation);

const Page = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    departmentId: "",
    level: 100,
  });

  const [errors, setErrors] = useState<any>({});

  const {
    data: faculties,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["faculties"],
    queryFn: getAllFaculty,
  });

  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stepRef.current) return;

    gsap.fromTo(
      stepRef.current,
      { x: 100, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.3 }
    );
  }, [step]);

  const { isAuthenticated, setIsAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const totalSteps = 3;

  const animateStep = (direction: "next" | "back") => {
    if (!stepRef.current) return;

    const tl = gsap.timeline();

    tl.to(stepRef.current, {
      x: direction === "next" ? -100 : 100,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setStep((prev) => (direction === "next" ? prev + 1 : prev - 1));
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    try {
      setLoading(true);
      const response = await signup(formData);

      if (response.success) {
        Cookies.set("uninav_", response.token || "Techpro", {
          expires: 7,
          path: "",
        });
        setIsAuthenticated(true);
        router.push("/dashboard");
      } else {
        throw new Error(response.message || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong during signup!");
    } finally {
      setLoading(false);
    }
  };

  const validateStep = () => {
    const currentErrors: any = {};
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
    }
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDeptChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      departmentId: value,
    }));
  };

  const handleLevelChange = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      level: value,
    }));
  };

  const handleNext = () => {
    if (validateStep()) {
      animateStep("next");
    }
  };

  const handleBack = () => {
    animateStep("back");
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="login_container">
      {isLoading ? (
        <Loader />
      ) : error ? (
        <p>Failed to load faculties</p>
      ) : (
        <div className="grid grid-cols-12">
          <div className="hidden md:block md:col-span-6">
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

          <div className="col-span-12 md:col-span-6 m-3 md:m-0 h-screen md:h-auto">
            <div className="m-auto mt-10 p-2 md:p-5 md:px-10 rounded-lg w-10/12 form_cover">
              <div className="text-center form_head">
                <h1 className="flex justify-center items-center gap-5 text-3xl md:text-4xl fst">
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
                <div className="bg-gray-200 rounded-full w-full h-2">
                  <div
                    className="bg-blue-500 rounded-full h-2 transition-all duration-500"
                    style={{ width: `${(step / totalSteps) * 100}%` }}
                  ></div>
                </div>
                <p className="mt-2 font-medium text-gray-600 text-sm text-center">
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
                          className="block mb-1 font-medium text-gray-700 text-sm fst"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="John"
                          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-red-500 text-xs">
                            {errors.firstName}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block mb-1 font-medium text-gray-700 text-sm fst"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Doe"
                          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-red-500 text-xs">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <div></div>
                        <Button
                          text="Next"
                          onClick={handleNext}
                          type="button"
                        />
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <div>
                        <label
                          htmlFor="username"
                          className="block mb-1 font-medium text-gray-700 text-sm fst"
                        >
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          placeholder="johnd1oe"
                          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        {errors.username && (
                          <p className="mt-1 text-red-500 text-xs">
                            {errors.username}
                          </p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block mb-1 font-medium text-gray-700 text-sm fst"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="example@example.com"
                          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        {errors.email && (
                          <p className="mt-1 text-red-500 text-xs">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <Button
                          text="Back"
                          onClick={handleBack}
                          type="button"
                        />
                        <Button
                          text="Next"
                          onClick={handleNext}
                          type="button"
                        />
                      </div>
                    </>
                  )}

                  {step === 3 && (
                    <>
                      <div>
                        <label
                          htmlFor="password"
                          className="block mb-1 font-medium text-gray-700 text-sm fst"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="******"
                          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                        {errors.password && (
                          <p className="mt-1 text-red-500 text-xs">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div>
                        {faculties?.data ? (
                          <SelectDemo
                            dept={faculties}
                            value={formData.departmentId}
                            onChange={handleDeptChange}
                          />
                        ) : (
                          <p>No faculty found</p>
                        )}
                        {errors.departmentId && (
                          <p className="mt-1 text-red-500 text-xs">
                            {errors.departmentId}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="level"
                          className="block mb-1 font-medium text-gray-700 text-sm fst"
                        >
                          Level
                        </label>
                        <select
                          id="level"
                          value={formData.level}
                          onChange={(e) =>
                            handleLevelChange(Number(e.target.value))
                          }
                          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        >
                          <option value="">Select Level</option>
                          <option value={100}>100</option>
                          <option value={200}>200</option>
                          <option value={300}>300</option>
                          <option value={400}>400</option>
                          <option value={500}>500</option>
                        </select>
                        {errors.level && (
                          <p className="mt-1 text-red-500 text-xs">
                            {errors.level}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between">
                        <Button
                          text="Back"
                          onClick={handleBack}
                          type="button"
                        />
                        <Button text="Submit" type="submit" />
                      </div>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
