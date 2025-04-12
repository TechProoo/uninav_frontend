"use client";

import PostForm from "@/components/blog/BlogForm";
import React from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  return (
    <div className=" mx-auto animate-fade-in">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-6"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        <span className="text-sm font-medium">Back</span>
      </button>

      <div className="space-y-2 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Post Blog</h1>
        <p className="text-gray-600">Create and post your blog</p>
      </div>

      <div className="bg-white border rounded-xl shadow-sm p-6">
        <PostForm />
      </div>
    </div>
  );
};

export default Page;
