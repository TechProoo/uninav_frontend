"use client";

import { Blog } from "@/lib/types/response.type";
import { useQuery } from "@tanstack/react-query";
import { Calendar, ChevronLeft, Eye, X, ThumbsUp } from "lucide-react";
import React, { useState } from "react";
import draftToHtml from "draftjs-to-html";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { getBlogById, toggleBlogLike } from "@/api/blog.api";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface BlogDetailProps {
  blogId: string;
  onClose?: () => void;
  showBackButton?: boolean;
}

const BlogDetail: React.FC<BlogDetailProps> = ({
  blogId,
  onClose,
  showBackButton = false,
}) => {
  const router = useRouter();
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [localBlog, setLocalBlog] = useState<
    (Blog & { isLiked: boolean }) | null
  >(null);

  const {
    data: blog,
    isLoading,
    error,
  } = useQuery<Blog & { isLiked: boolean }>({
    queryKey: ["blogsId", blogId],
    queryFn: async () => {
      if (!blogId) throw new Error("Blog ID is required");
      const data = await getBlogById(blogId);
      if (!data) throw new Error("Blog not found");
      return { ...data.data, isLiked: false };
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!blogId,
  });

  React.useEffect(() => {
    if (blog) {
      setLocalBlog(blog);
    }
  }, [blog]);

  const handleBack = () => {
    router.back();
  };

  // Handle like/unlike action with optimistic update
  const handleLikeToggle = async () => {
    if (isLiking || !localBlog) return;

    try {
      setIsLiking(true);
      // Optimistic update
      setLocalBlog((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          likes: prev.likes + (prev.isLiked ? -1 : 1),
          isLiked: !prev.isLiked,
        };
      });

      const response = await toggleBlogLike(localBlog.id);
      if (response?.status === "success") {
        // Update with actual server state
        setLocalBlog((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            likes: response.data.likesCount,
            isLiked: response.data.liked,
          };
        });
      }
    } catch (error) {
      // Revert optimistic update on error
      setLocalBlog((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          likes: prev.likes + (prev.isLiked ? 1 : -1),
          isLiked: !prev.isLiked,
        };
      });
      const err = error as Error;
      toast.error(err?.message || "Failed to update like status");
      console.error("Error toggling blog like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (error || !localBlog) {
    return (
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-red-600 text-xl">Error</h2>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
        <p className="text-red-600">
          {error instanceof Error ? error.message : "Failed to load blog"}
        </p>
      </div>
    );
  }

  // Determine if this component is being used in a modal or standalone
  const isModal = !!onClose;

  return (
    <div
      className={`relative ${isModal ? "overflow-y-auto max-h-[85vh]" : ""}`}
    >
      {/* Header with close button for modal or back button for standalone */}
      {(isModal || showBackButton) && (
        <div className="top-0 z-10 sticky flex justify-between items-center bg-white px-6 py-4 border-b">
          <div className="flex items-center">
            {showBackButton && !isModal && (
              <Button variant="ghost" className="mr-2" onClick={handleBack}>
                <ChevronLeft className="mr-1 w-5 h-5" />
                Back
              </Button>
            )}
            {isModal && <h2 className="font-bold text-xl">Blog Details</h2>}
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
      )}

      {/* Blog content */}
      <div>
        <div className="bg-gray-900 p-4 sm:p-6 md:p-8">
          <div className="gap-4 grid grid-cols-1 md:grid-cols-12">
            <div className="md:col-span-5 px-2 md:px-6 text-left md:text-right">
              <span className="inline-block bg-red-700 px-3 py-1 rounded-xl font-bold text-white text-sm">
                {localBlog.type}
              </span>
              <h1 className="mt-4 font-bold text-white text-3xl md:text-4xl leading-tight">
                {localBlog.title}
              </h1>
              <div className="mt-4 text-gray-400 text-sm">
                <b>
                  Author -{" "}
                  <span className="font-semibold text-white">
                    {localBlog.creator.username}
                  </span>
                </b>
              </div>
              <div className="flex justify-start md:justify-end items-center gap-4 mt-4 text-gray-300 text-sm">
                <div className="flex items-center gap-1">
                  <Eye size={15} className="text-gray-500" />
                  <b className="text-sm">{localBlog.views}</b>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLikeToggle}
                  disabled={isLiking}
                  className={cn(
                    "flex items-center gap-1 p-1",
                    localBlog.isLiked ? "text-blue-400" : "text-gray-400"
                  )}
                >
                  <ThumbsUp
                    className={cn(
                      "w-4 h-4",
                      localBlog.isLiked && "fill-current"
                    )}
                  />
                  <span>{localBlog.likes}</span>
                </Button>
              </div>

              <div className="flex justify-start md:justify-end items-center mt-4 text-gray-300 text-sm">
                <Calendar size={14} className="mr-2" />
                <span>
                  {new Date(localBlog.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="md:col-span-7">
              <div className="shadow-lg rounded-md overflow-hidden">
                {localBlog.headingImageAddress ? (
                  <img
                    src={localBlog.headingImageAddress}
                    alt="Blog cover"
                    className="w-full h-auto max-h-[400px] object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center bg-gray-800 w-full h-[200px] md:h-[300px]">
                    <p className="text-gray-400">No cover image available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="mb-8 text-center">
            <blockquote className="pl-4 border-gray-400 border-l-4 text-gray-600 text-base md:text-lg italic">
              {localBlog.description}
            </blockquote>
          </div>

          <article className="max-w-none prose">
            <div
              className="ql-editor"
              dangerouslySetInnerHTML={{
                __html: draftToHtml(JSON.parse(localBlog.body)),
              }}
            />
          </article>

          {localBlog.tags && localBlog.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 mt-8 pt-4 border-t">
              <p className="font-medium">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {localBlog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 px-3 py-1 rounded-lg text-gray-800 text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
