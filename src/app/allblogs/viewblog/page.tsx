"use client";
import { useSearchParams } from "next/navigation";
import React from "react";
import BlogDetail from "@/components/blog/BlogDetail";

const page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  if (!id) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="font-semibold text-red-600 text-center">
          Blog ID is required
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 container">
      <BlogDetail blogId={id} showBackButton={true} />
    </div>
  );
};

export default page;
