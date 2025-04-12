"use client";

import React from "react";
import { Blog } from "@/lib/types/response.type";
import BlogCard from "./blogCard";

interface BlogGridProps {
  blogs: Blog[];
  onBlogClick: (blog: Blog) => void;
  viewMode?: "grid" | "list";
}

const BlogGrid: React.FC<BlogGridProps> = ({
  blogs,
  onBlogClick,
  viewMode = "grid",
}) => {
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            onClick={() => onBlogClick(blog)}
            className="cursor-pointer"
          >
            <BlogCard data={blog} viewMode="list" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          onClick={() => onBlogClick(blog)}
          className="cursor-pointer"
        >
          <BlogCard data={blog} viewMode="grid" />
        </div>
      ))}
    </div>
  );
};

export default BlogGrid;
