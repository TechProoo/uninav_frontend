"use client";

import Card from "@/components/blog/card";
import NoBlog from "@/components/blog/NoBlog";
import Button from "@/components/blog/Button-styled";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../loading";
import { Blog } from "@/lib/types/response.type";
import { deleteBlog, getUserBlogs } from "@/api/blog.api";

const BlogsPage = () => {
  const router = useRouter();

  const [blogs, setBlogs] = useState<Blog[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const fetchedBlogs = await getUserBlogs();
        setBlogs(fetchedBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleDelete = async (postId: string) => {
    try {
      setBlogs(
        (prevBlogs) => prevBlogs?.filter((blog) => blog.id !== postId) || null
      );
      await deleteBlog(postId);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  if (isLoading) return <Loader />;
  if (!blogs || blogs.length === 0) return <NoBlog />;

  return (
    <div className="w-full">
      <div className="md:flex justify-between items-center mb-5 md:mb-1 w-full">
        <h1 className="mb-6 font-bold text-3xl fst">Manage Blogs</h1>
        <div className="flex items-center gap-4">
          <Button
            text="All Blogs"
            onClick={() => handleNavigation("/explore?defaultTab=blogs")}
          />
          <Button
            text="Create Blog"
            onClick={() => handleNavigation("/dashboard/blogs/createblog")}
          />
        </div>
      </div>

      <div className="mt-10 font-bold text-2xl fst">
        <h1>Your Blogs</h1>
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6">
          {blogs.map((blog: Blog) => (
            <Card key={blog.id} data={blog} onDelete={handleDelete} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
