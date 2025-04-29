"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { Blog } from "@/lib/types/response.type";
import BlogDetail from "@/components/blog/BlogDetail";
import BlogForm from "@/components/blog/BlogForm";
import { getBlogById } from "@/api/blog.api";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthContext, useAuth } from "@/contexts/authContext";

export default function BlogPage() {
  const { blogId } = useParams();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const [isOwner, setIsOwner] = useState(false);
  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogId || typeof blogId !== "string") {
        setError("Invalid blog ID");
        setLoading(false);
        return;
      }

      try {
        const response = await getBlogById(blogId);
        setBlog(response.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setError("An error occurred while loading the blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);
  useEffect(() => {
    if (user && blog && blog.creatorId === user.id) {
      setIsOwner(true);
    }
    console.log(isOwner, user, blog);
  }, [user, blog]);

  const handleEdit = (blog: Blog) => {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto w-12 h-12 text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex flex-col justify-center items-center p-4 min-h-screen">
        <div className="bg-red-50 p-6 border border-red-200 rounded-lg max-w-md text-center">
          <h2 className="mb-2 font-bold text-red-600 text-xl">Error</h2>
          <p className="mb-6 text-gray-700">
            {error ||
              "Blog not found. It may have been removed or you don't have permission to view it."}
          </p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          asChild
          onClick={() => {
            router.back();
          }}
          className="border border-black cursor-pointer hover:bg-black hover:text-white"
        >
          <div className="flex items-center gap-2">
            <span>← Back </span>
          </div>
        </Button>         
      </div>
      {isEditing ? (
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
          blogId={blog.id}
          isOwner={isOwner}
          onEdit={handleEdit}
          onDelete={handleDelete}
          showBackButton={false}
        />
      )}
    </div>
  );
}
