"use client";

import React, { useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAuth } from "@/contexts/authContext";
import { useRouter, useSearchParams } from "next/navigation";
import { ButtonSlider } from "@/components/ui/ButtonSlider";
import {
  verifyEmailByCode,
  verifyEmailByToken,
  resendEmailVerification,
} from "@/api/auth.api";
import toast from "react-hot-toast";
import Loader from "./loading";

const VerifyEmailPage = () => {
  const { user, refreshUserProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || user?.email || "";
  const token = searchParams.get("token");

  const [verificationCode, setVerificationCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(!!token); // Start loading if token exists
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [isVerifyingToken, setIsVerifyingToken] = useState<boolean>(!!token); // Track if token verification is active
  const [emailInput, setEmailInput] = useState<string>(email || "");
  const [showVerificationForm, setShowVerificationForm] = useState<boolean>(
    !token
  ); // Control form visibility

  // Array to hold 6 input references for the verification code
  const [codeInputs, setCodeInputs] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  // Effect to update emailInput if email from query params changes
  useEffect(() => {
    if (email) {
      setEmailInput(email);
    }
  }, [email]);

  // Effect to handle automatic token verification
  useEffect(() => {
    const verifyWithToken = async () => {
      // Only run if token exists, form isn't shown yet, and not already verifying
      if (token && !showVerificationForm && isVerifyingToken) {
        setLoading(true); // Ensure loading state is true
        try {
          // since token is automatically decoded when using useSearchParams, we have to encode it back as that's what the server expects
          let encodedToken = encodeURIComponent(token);
          const response = await verifyEmailByToken(encodedToken);
          toast.success(response.message || "Email verified successfully!");
          toast.loading("Redirecting...", {
            duration: 2000,
          });
          // Update user profile to get the latest verification status
          await refreshUserProfile();
          router.push("/dashboard");
          // No need to set loading false here as we are redirecting
        } catch (error: any) {
          console.error("Error verifying email with token:", error);
          toast.error(
            error.message ||
              "Token verification failed. Please use the code instead."
          );
          setShowVerificationForm(true); // Show the form on error
          setIsVerifyingToken(false); // Stop token verification attempt
          setLoading(false); // Stop loading indicator
        }
        // Removed finally block as success leads to redirect
      } else if (!token) {
        // If no token, ensure loading is false and form is shown
        setLoading(false);
        setShowVerificationForm(true);
        setIsVerifyingToken(false);
      }
    };

    verifyWithToken();
    // Dependencies: token, showVerificationForm, isVerifyingToken, refreshUserProfile, router
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isVerifyingToken, refreshUserProfile, router]); // Removed showVerificationForm from deps to avoid loop on error

  // Effect to handle countdown for resend button
  useEffect(() => {
    if (countdown === 0) return;

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    const initializeLottie = async () => {
      const lottie = (await import("lottie-web")).default;
      const { defineElement } = await import("@lordicon/element");
      defineElement(lottie.loadAnimation);
    };

    initializeLottie();
  }, []);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailInput) {
      toast.error("Email is required");
      return;
    }

    const combinedCode = codeInputs.join("");
    if (combinedCode.length !== 6) {
      toast.error("Please enter all 6 digits of the verification code");
      return;
    }

    try {
      setLoading(true);
      const response = await verifyEmailByCode(emailInput, combinedCode);

      toast.success(response.message || "Email verified successfully!");
      toast.loading("Redirecting...", {
        duration: 2000,
      });
      // user needs to be loggedin to get session from server
      router.push("/auth/login");
    } catch (error: any) {
      console.error("Error verifying email:", error);
      toast.error(error.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!emailInput) {
      toast.error("Email is required");
      return;
    }

    try {
      setResendLoading(true);
      const response = await resendEmailVerification(emailInput);

      if (response.status === "success") {
        toast.success("Verification code resent successfully!");
        setCountdown(60); // Start a 60-second countdown
      } else {
        toast.error(
          response.message || "Failed to resend code. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Error resending code:", error);
      toast.error(error.message || "Failed to resend code. Please try again.");
      if (error.message.toLowerCase().includes("already verified")) {
        toast.loading("Redirecting...", {
          duration: 2000,
        });
        router.push("/auth/login");
      }
    } finally {
      setResendLoading(false);
    }
  };

  // Handle code input change - updates the array and auto-focuses next input
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      // If pasting a longer string, try to distribute it across inputs
      const valueArray = value.split("").slice(0, 6);
      const newInputs = [...codeInputs];

      valueArray.forEach((char, i) => {
        if (index + i < 6) {
          newInputs[index + i] = char;
        }
      });

      setCodeInputs(newInputs);

      // Focus the next empty input or the last one
      const nextEmptyIndex = newInputs.findIndex((val) => val === "");
      if (nextEmptyIndex !== -1) {
        document.getElementById(`code-${nextEmptyIndex}`)?.focus();
      } else {
        document.getElementById(`code-5`)?.focus();
      }
    } else {
      // Normal single character input
      const newInputs = [...codeInputs];
      newInputs[index] = value;
      setCodeInputs(newInputs);

      // Auto-focus next input if value is entered
      if (value && index < 5) {
        document.getElementById(`code-${index + 1}`)?.focus();
      }
    }
  };

  // Handle backspace to move to previous input
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !codeInputs[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus();
    }
  };

  // Show loader if loading state is true (covers both token and code verification)
  if (loading && isVerifyingToken && !showVerificationForm) {
    return <Loader message="Verifying email via token..." />;
  }

  return (
    // Use flexbox to center the content vertically and horizontally
    <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-900 p-2 min-h-screen login_container">
      {/* Adjust grid for responsiveness and centering - REMOVE background, shadow, rounded */}
      <div className="gap-8 grid grid-cols-1 md:grid-cols-12 w-full max-w-6xl overflow-hidden">
        {/* Animation Column - REMOVE background */}
        <div className="hidden md:flex justify-center items-center md:col-span-6 p-8">
          {/* Optional: Constrain animation size if needed */}
          <div className="w-full h-auto">
            <DotLottieReact
              src="https://lottie.host/9e4bbcc1-7395-44bd-95a9-bb65892fcadc/EFETH2vZML.lottie"
              loop
              autoplay
            />
          </div>
        </div>

        {/* Form Column - Ensure it centers content */}
        <div className="flex justify-center items-center col-span-1 md:col-span-6 p-6 md:p-10">
          {/* Form Card - ADD background, shadow, rounded */}
          <div className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-lg w-full max-w-md form_cover">
            <div className="mb-8 text-center form_head">
              {" "}
              {/* Added margin-bottom */}
              <h1 className="flex justify-center items-center gap-3 font-semibold text-gray-800 dark:text-white text-2xl md:text-3xl fst">
                Verify Your Email
                {/* @ts-ignore */}
                <lord-icon
                  src="https://cdn.lordicon.com/rhvddzym.json"
                  trigger="loop"
                  colors="primary:#121331,secondary:#66d7ee" // Adjust colors if needed for dark mode
                  style={{ width: "45px", height: "45px" }}
                  /* @ts-ignore */
                ></lord-icon>
              </h1>
              {/* Conditional text based on whether the form is shown */}
              {token && !showVerificationForm ? (
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  Verifying your email address via token...
                </p>
              ) : (
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  A verification code has been sent to your email address.
                  Please enter it below to verify your email.
                  <span className="block mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Don't forget to check your spam folder if you don't see the email in your inbox.
                  </span>
                </p>
              )}
            </div>

            {/* Render form only if showVerificationForm is true */}
            {showVerificationForm && (
              <form onSubmit={handleVerifyEmail} className="space-y-6">
                {" "}
                {/* Use space-y for spacing */}
                {/* Email input field */}
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="block mb-1 font-medium text-gray-700 dark:text-gray-200 text-sm fst"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="your@email.com"
                    className="bg-gray-50 dark:bg-gray-700 p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full dark:text-white"
                    required
                    // Disable if verifying via token initially and form just appeared due to error
                    // disabled={token && !showVerificationForm}
                  />
                </div>
                {/* Verification Code Inputs */}
                <div className="flex justify-center gap-2 md:gap-3">
                  {" "}
                  {/* Reduced gap slightly */}
                  {codeInputs.map((value, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text" // Consider type="tel" for numeric keyboard on mobile
                      inputMode="numeric" // Helps mobile keyboards
                      pattern="[0-9]*" // Basic pattern for numbers
                      value={value}
                      onChange={
                        (e) =>
                          handleCodeChange(
                            index,
                            e.target.value.replace(/[^0-9]/g, "")
                          ) // Ensure only numbers
                      }
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      maxLength={1}
                      className="bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-10 md:w-12 h-12 md:h-14 font-medium dark:text-white text-xl md:text-2xl text-center"
                      required
                      autoComplete="one-time-code" // Helps with autofill
                    />
                  ))}
                </div>
                {/* Actions */}
                <div className="flex flex-col items-center gap-4 pt-4 w-full">
                  {" "}
                  {/* Added padding-top */}
                  <ButtonSlider
                    text="Verify Email"
                    type="submit"
                    loading={loading && !isVerifyingToken} // Show loading only for code verification submit
                  />
                  <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                    Didn't receive the code?{" "}
                    {countdown > 0 ? (
                      <span className="text-gray-400 dark:text-gray-500">
                        Resend code in {countdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendCode}
                        disabled={resendLoading}
                        className="disabled:opacity-50 font-medium text-blue-600 hover:text-blue-800 dark:hover:text-blue-300 dark:text-blue-400"
                      >
                        {resendLoading ? "Sending..." : "Resend Code"}
                      </button>
                    )}
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
