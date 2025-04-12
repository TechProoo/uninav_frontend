"use client";

import BlogDetail from "@/components/blog/BlogDetail";
import { useParams } from "next/navigation";
import { Suspense } from "react";

const BlogPage = () => {
  const params = useParams();
  const blogId = params.blogId as string;

  return (
    <div className="bg-white mx-auto px-4 py-8 max-w-7xl min-h-screen">
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-20">
            <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        }
      >
        <BlogDetail blogId={blogId} showBackButton={true} />
      </Suspense>
    </div>
  );
};

export default BlogPage;
