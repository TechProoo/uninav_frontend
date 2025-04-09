"use client"

import PostForm from "@/components/blog/BlogForm";
import React from "react";
import { useRouter } from "next/navigation";

// export const metadata = {
//   layout: null,
// };

const page = () => {
  const router = useRouter();
  return (
    <div className="">
      <button
        type="button"
        onClick={() => router.back()}
        className="mb-6 flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back
      </button>

      <h1 className="text-3xl font-bold mb-2 fst">Post Blog</h1>
      <p className="text-gray-600 mb-4">Create and post your blog</p>
      <PostForm />
    </div>
  );
};

export default page;
