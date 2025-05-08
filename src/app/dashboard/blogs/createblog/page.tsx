"use client";

import PostForm from "@/components/blog/BlogForm";
import React from "react";
import { useRouter } from "next/navigation";
import BackButton from "@/components/ui/BackButton";

const Page = () => {
  const router = useRouter();

  return (
    <div className="mx-auto animate-fade-in">
      <div className="mb-6">
        <BackButton />
      </div>

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
