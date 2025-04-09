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
import { Content } from "@/lib/types/response.type";

const BlogsPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const id = user?.id;

  const { data: blogs, isLoading } = useQuery({
    queryKey: ["blogs", id],
    queryFn: () => getUserBlogs(id),
  });

  const [blogsData, setBlogsData] = useState<Content[]>([]);

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
  };

  if (isLoading) return <Loader />;
  if (blogsData.length === 0) return <NoBlog />;

  return (
    <div className="mx-auto container">
      <div className="md:flex mb-5 md:mb-1 justify-between items-center">
        <h1 className="mb-6 font-bold text-3xl fst">Manage Blogs</h1>
        <div className="flex items-center gap-4">
          <Button
            text="All Blogs"
            onClick={() => handleNavigation("/dashboard/blogs")}
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

      <div className="mt-10 fst font-bold text-2xl">
        <h1>Your Blogs</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {blogsData.map((blog: Content) => (
            <Card key={blog.id} data={blog} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage