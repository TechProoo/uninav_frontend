"use client";

import Card from "@/components/blog/card";
import NoBlog from "@/components/blog/NoBlog";
import Button from "@/components/blog/Button-styled";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import getUserBlogs from "@/api/userBlogs.api";
import { useQuery } from "@tanstack/react-query";
import Loader from "../loading";
import { Blog } from "@/lib/types/response.type";

const BlogsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const id = user?.id;

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["blogs", id],
    queryFn: () => getUserBlogs(id),
  });

  const [blogsData, setBlogsData] = useState<Blog[]>([]);

  useEffect(() => {
    if (blogs) {
      setBlogsData(blogs);
    }
  }, [blogs]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleDelete = (postId: string) => {
    setBlogsData((prev) => prev.filter((blog) => blog.id !== postId));
    router.refresh();
  };

  if (isLoading) return <Loader />;
  if (blogsData.length === 0) return <NoBlog />;

  return (
    <div className="mx-auto container">
      <div className="md:flex justify-between items-center mb-5 md:mb-1">
        <h1 className="mb-6 font-bold text-3xl fst">Manage Blogs</h1>
        <div className="flex items-center gap-4">
          <Button
            text="All Blogs"
            onClick={() => handleNavigation("/allblogs")}
          />
          <Button
            text="Create Blog"
            onClick={() => handleNavigation("/dashboard/blogs/createblog")}
          />
        </div>
      </div>

      <div className="shadow-lg p-8 rounded-lg">
        <p className="text-gray-600">
          Create, edit, delete and publish your blogs here
        </p>
      </div>

      <div className="mt-10 font-bold text-2xl fst">
        <h1>Your Blogs</h1>
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6">
          {blogsData.map((blog: Blog) => (
            <Card key={blog.id} data={blog} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
