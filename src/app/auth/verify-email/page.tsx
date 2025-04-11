"use client";

import React, { useState, useEffect } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAuth } from "@/contexts/authContext";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/Button-styled";
import { verifyEmailByCode, resendEmailVerification } from "@/api/auth.api";
import toast from "react-hot-toast";
import Loader from "./loading";
import Image from "next/image";
import Logo from "../../../../public/Image/logoo.png";

const VerifyEmailPage = () => {
  const { user, refreshUserProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || user?.email || "";

  const [verificationCode, setVerificationCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);

  // Array to hold 6 input references for the verification code
  const [codeInputs, setCodeInputs] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

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

    if (!email) {
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
      const response = await verifyEmailByCode(email, combinedCode);

      if (response.status === "success") {
        toast.success("Email verified successfully!");
        // Update user profile to get the latest verification status
        await refreshUserProfile();
        router.push("/dashboard");
      } else {
        toast.error(
          response.message || "Verification failed. Please try again."
        );
      }
    } catch (error: any) {
      console.error("Error verifying email:", error);
      toast.error(error.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error("Email is required");
      return;
    }

    try {
      setResendLoading(true);
      const response = await resendEmailVerification(email);

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
      <div className="absolute mx-1 w-[70px]">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M16.9456 2.84731C18.3542 2.14979 19.0585 1.80104 19.5345 2.11769C20.0104 2.43435 19.9427 3.20671 19.8074 4.75143L19.7724 5.15106C19.7339 5.59003 19.7147 5.80951 19.7834 6.00845C19.852 6.2074 20.0008 6.36329 20.2984 6.67507L20.5694 6.95892C21.6166 8.05609 22.1402 8.60468 21.9676 9.16677C21.795 9.72887 21.0405 9.93221 19.5315 10.3389L19.1411 10.4441C18.7123 10.5597 18.4979 10.6175 18.3269 10.7517C18.156 10.8859 18.0478 11.0814 17.8314 11.4723L17.6344 11.8281C16.873 13.2038 16.4924 13.8916 15.9098 13.9223C15.3272 13.953 14.9285 13.3063 14.1312 12.013L13.925 11.6784C13.6984 11.3108 13.5851 11.1271 13.4108 11.0111C13.2365 10.8951 13.0208 10.86 12.5895 10.7898L12.1968 10.7259C10.6791 10.4789 9.92016 10.3554 9.7327 9.81228C9.54524 9.26918 10.0534 8.66616 11.0696 7.46012L11.3325 7.14811C11.6213 6.80539 11.7657 6.63403 11.8289 6.42812C11.8921 6.22222 11.867 6.00508 11.8168 5.57079L11.7711 5.17542C11.5945 3.64716 11.5062 2.88303 11.9729 2.51664C12.4396 2.15025 13.1523 2.42425 14.5776 2.97224L14.9464 3.11402C15.3514 3.26974 15.554 3.3476 15.7674 3.33634C15.9808 3.32508 16.1809 3.22598 16.5812 3.02776L16.9456 2.84731Z"
              fill="#1C274C"
            ></path>
          </g>
        </svg>
      </div>
      <div className="">
        <Image className="w-50" src={Logo} alt="Uninav Logo" />
      </div>

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

        <div className="col-span-12 md:col-span-6 m-3 md:m-0 h-screen md:h-auto">
          <div className="m-auto mt-10 p-2 md:p-5 md:px-10 rounded-lg w-10/12 form_cover">
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
              <p className="mt-2">
                A verification code has been sent to{" "}
                <span className="font-medium">{email}</span>. Please enter it
                below to verify your email address.
              </p>
            </div>

            <form onSubmit={handleVerifyEmail} className="mt-8">
              <div className="flex flex-col items-center">
                <div className="flex justify-center gap-2 md:gap-4 mb-8">
                  {codeInputs.map((value, index) => (
                    <input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      value={value}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
