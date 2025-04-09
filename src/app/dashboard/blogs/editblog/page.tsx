"use client";

import getBlogById from "@/api/blogById.api";
import PostForm from "@/components/blog/BlogForm";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React from "react";
import Loader from "../../loading";

const page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    data: blogs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["blogsId", id],
    queryFn: () => (id ? getBlogById(id) : Promise.reject("Invalid blog ID")),
  });

  console.log(id);

  console.log(blogs);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <h1 className="mb-6 font-bold text-3xl fst">Edit Blog</h1>
      <div className="shadow-lg p-8 rounded-lg">
        <p className="text-gray-600">
          Update the content of your blog posts here.
        </p>
      </div>
      <div className="mt-10">
        <PostForm data={blogs} />
      </div>
    </div>
  );
};

export default page;
