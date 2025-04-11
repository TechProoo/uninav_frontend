"use client";

import React, { useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAuth } from "@/contexts/authContext";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button-styled";
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
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>(email || "");

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
      if (token && !isVerifying) {
        setIsVerifying(true);
        setLoading(true);
        try {
          const response = await verifyEmailByToken(token);
          toast.success(response.message || "Email verified successfully!");
          toast.loading("Redirecting...", {
            duration: 2000,
          });
          // Update user profile to get the latest verification status
          await refreshUserProfile();
          router.push("/dashboard");
        } catch (error: any) {
          console.error("Error verifying email with token:", error);
          toast.error(
            error.message ||
              "Verification failed. Please try again with the code."
          );
        } finally {
          setLoading(false);
        }
      }
    };

    verifyWithToken();
  }, [token, isVerifying, refreshUserProfile, router]);

  // Effect to handle countdown for resend button
  useEffect(() => {
    if (countdown === 0) return;

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

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
      // Update user profile to get the latest verification status
      await refreshUserProfile();
      router.push("/dashboard");
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

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="login_container">
      <div className="grid grid-cols-12">
        <div className="hidden md:block md:col-span-6">
          <div className="h-screen">
            <DotLottieReact
              src="https://lottie.host/9e4bbcc1-7395-44bd-95a9-bb65892fcadc/EFETH2vZML.lottie"
              loop
              autoplay
            />
          </div>
        </div>

        <div className="flex justify-center items-center col-span-12 md:col-span-6 m-3 md:m-0 h-screen md:h-auto">
          <div className="p-2 md:p-5 md:px-10 rounded-lg w-10/12 form_cover">
            <div className="text-center form_head">
              <h1 className="flex justify-center items-center gap-5 text-3xl md:text-4xl fst">
                Verify Your Email
                {/* @ts-ignore */}
                <lord-icon
                  src="https://cdn.lordicon.com/rhvddzym.json"
                  trigger="loop"
                  colors="primary:#121331,secondary:#66d7ee"
                  style={{ width: "55px", height: "55px" }}
                  /* @ts-ignore */
                ></lord-icon>
              </h1>
              {token ? (
                <p className="mt-2">Verifying your email address...</p>
              ) : (
                <p className="mt-2">
                  A verification code has been sent to your email address.
                  Please enter it below to verify your email.
                </p>
              )}
            </div>

            {!token && (
              <form onSubmit={handleVerifyEmail} className="mt-8">
                <div className="flex flex-col items-center">
                  {/* Email input field */}
                  <div className="mb-6 w-full">
                    <label
                      htmlFor="email"
                      className="block mb-1 font-medium text-gray-700 text-sm fst"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="your@email.com"
                      className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      required
                    />
                  </div>

                  <div className="flex justify-center gap-2 md:gap-4 mb-8">
                    {codeInputs.map((value, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        value={value}
                        onChange={(e) =>
                          handleCodeChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        maxLength={1}
                        className="border-2 border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-10 md:w-12 h-14 md:h-16 font-medium text-xl md:text-2xl text-center"
                        required
                      />
                    ))}
                  </div>

                  <div className="flex flex-col items-center gap-4 w-full">
                    <Button text="Verify Email" type="submit" />
                    <p className="text-sm text-center">
                      Didn't receive the code?{" "}
                      {countdown > 0 ? (
                        <span className="text-gray-400">
                          Resend code in {countdown}s
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendCode}
                          disabled={resendLoading}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {resendLoading ? "Sending..." : "Resend Code"}
                        </button>
                      )}
                    </p>
                  </div>
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
