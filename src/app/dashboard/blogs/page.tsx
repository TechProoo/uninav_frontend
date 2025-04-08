"use client";

import TrustCard from "@/components/blog/card";
import NoBlog from "@/components/blog/NoBlog";
import Button from "@/components/blog/Button-styled";
import React from "react";
import { useRouter } from "next/navigation";

const BlogsPage = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };
  return (
    <div className="mx-auto container">
      <div className="md:flex mb-5 md:mb-1  justify-between items-center">
        <h1 className="mb-6 font-bold text-3xl fst">Manage Blogs</h1>
        <div className="flex items-center gap-3">
          <Button
            text="All Blogs"
            onClick={() => handleNavigation("/dashboard/blogs/createblog")}
          />
          <Button
            onClick={() => handleNavigation("/dashboard/blogs/createblog")}
            text="Create Blog"
          />
        </div>
      </div>
      <div className=" shadow-lg p-8 rounded-lg">
        <p className="text-gray-600">
          Create, edit, delete and publish yeur blogs here
        </p>
      </div>
      <div className="mt-10 fst font-bold text-2xl">
        <h1>Your Blogs</h1>
        <TrustCard />
        <NoBlog />
      </div>
    </div>
  );
};

export default BlogsPage;
