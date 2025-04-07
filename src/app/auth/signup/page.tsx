"use client";

import React, { useEffect, useRef, useState } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import lottie from "lottie-web";
import { defineElement } from "@lordicon/element";
import Button from "@/components/ui/Button";
import { SelectDemo } from "@/components/ui/SelectDrop";
import gsap from "gsap";
import { useQuery } from "@tanstack/react-query";
import { getAllFaculty } from "@/api/department";
import Loader from "./loading";
import { signup } from "@/api/signup";
import { FormData } from "@/lib/data.type";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useAuth } from "@/contexts/authContext";

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

  const { isAuthenticated } = useAuth();

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
      console.log(formData);
      const response = await signup(formData);
      if (!response) {
        console.log(response);
      }

      console.log(response);

      Cookies.set("uninav_", "Techpro", { expires: 7, path: "" });

      // Redirect to the dashboard
      router.push("/dashboard");
    } catch (error) {
      // Handle any errors that might occur during the signup process
      alert("An error has occurred");

      // Optionally reset isSubmit if you want the form to be re-submittable
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

          <div className="md:col-span-6 col-span-12 md:h-auto h-screen md:m-0 m-3">
            <div className="form_cover mt-10 w-10/12 md:p-5 p-2 md:px-10 rounded-lg m-auto">
              <div className="form_head text-center">
                <h1 className="md:text-4xl text-3xl fst flex items-center justify-center gap-5">
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
                          onChange={handleInputChange}
                          placeholder="John"
                          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          onChange={handleInputChange}
                          placeholder="Doe"
                          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-xs mt-1">
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
                          className="block text-sm font-medium text-gray-700 fst mb-1"
                        >
                          Username
                        </label>
                        <input
                          type="text"
                          id="username"
                          value={formData.username}
                          onChange={handleInputChange}
                          placeholder="johnd1oe"
                          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          onChange={handleInputChange}
                          placeholder="example@example.com"
                          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">
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
                          className="block text-sm font-medium text-gray-700 fst mb-1"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="******"
                          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.password && (
                          <p className="text-red-500 text-xs mt-1">
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
                        <select
                          id="level"
                          value={formData.level}
                          onChange={(e) =>
                            handleLevelChange(Number(e.target.value))
                          }
                          className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Level</option>
                          <option value={100}>100</option>
                          <option value={200}>200</option>
                          <option value={300}>300</option>
                          <option value={400}>400</option>
                          <option value={500}>500</option>
                        </select>
                        {errors.level && (
                          <p className="text-red-500 text-xs mt-1">
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
