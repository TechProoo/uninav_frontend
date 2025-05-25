"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Blog } from "@/lib/types/response.type";
import BlogDetail from "@/components/blog/BlogDetail";
import BlogForm from "@/components/blog/BlogForm";
import { getBlogById } from "@/api/blog.api";

export default function BlogPage() {
  const { blogId } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const handleEdit = (blog: Blog) => {
    setBlog(blog);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    // Refresh the blog data
    if (typeof blogId === "string") {
      getBlogById(blogId).then((response) => {
        if (response?.status === "success") {
          setBlog(response.data);
        }
      });
    }
  };

  const handleDelete = () => {
    // After successful delete, redirect to blogs page
    router.push("/dashboard/blogs");
  };

  return (
    <div className="mx-auto px-4 py-8 max-w-6xl pt-24">
      {isEditing && blog ? (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="mb-4 font-medium text-2xl">Edit Blog</h2>
          <BlogForm
            data={blog}
            onSuccess={handleEditSuccess}
            onCancel={handleEditCancel}
          />
        </div>
      ) : (
        <BlogDetail
          blogId={blogId as string}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showBackButton={false}
        />
      )}
    </div>
  );
}
