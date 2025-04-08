import PostForm from "@/components/blog/BlogForm";
import React from "react";

export const metadata = {
  layout: null,
};

const page = () => {
  return <div className="">
    <h1 className="text-3xl font-bold mb-2 fst">Post Blog</h1>
    <p className="text-gray-600 mb-4">Create and post your blog</p>
    <PostForm />
  </div>;
};

export default page;
