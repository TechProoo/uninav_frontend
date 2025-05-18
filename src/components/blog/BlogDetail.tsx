"use client";

import { Blog } from "@/lib/types/response.type";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  ChevronLeft,
  Eye,
  X,
  ThumbsUp,
  Edit,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import draftToHtml from "draftjs-to-html";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { getBlogById, toggleBlogLike, deleteBlog } from "@/api/blog.api";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import DeleteConfirmationModal from "../ui/DeleteConfirmationModal";
import { useAuth } from "@/contexts/authContext";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

interface BlogDetailProps {
  blogId: string;
  onClose?: () => void;
  showBackButton?: boolean;
  isOwner?: boolean;
  onEdit?: (blog: Blog) => void;
  onDelete?: (blogId: string) => void;
}

const BlogDetail: React.FC<BlogDetailProps> = ({
  blogId,
  onClose,
  showBackButton = false,
  isOwner = false,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [localBlog, setLocalBlog] = useState<
    (Blog & { isLiked: boolean }) | null
  >(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();
  const [isOwnerState, setIsOwnerState] = useState(isOwner);
  useEffect(() => {
    if (user && localBlog && user.id === localBlog.creatorId) {
      setIsOwnerState(true);
    } else {
      setIsOwnerState(isOwner);
    }
  }, [user, localBlog]);
  useEffect(() => {
    console.log("is owner state", isOwnerState);
  }, [isOwnerState]);
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

  // Determine if this component is being used in a modal or standalone
  const isModal = !!onClose;

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
    if (!user) {
      toast.error("You must be logged in to like a blog");
      return;
    }
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

  const handleEdit = () => {
    if (onEdit && localBlog) {
      onEdit(localBlog);
    }
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!localBlog) return;

    try {
      setIsDeleting(true);
      await deleteBlog(localBlog.id);
      toast.success("Blog deleted successfully");

      if (onDelete) {
        onDelete(localBlog.id);
      } else {
        // If no onDelete handler is provided, navigate to blogs page
        router.push("/dashboard/blogs");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("Failed to delete blog. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="relative">
        {/* Header Skeleton */}
        {(isModal || showBackButton) && (
          <div className="top-0 z-10 sticky flex justify-between items-center bg-white px-6 py-4 border-b">
            <div className="flex items-center">
              {showBackButton && !isModal && (
                <SkeletonLoader width="100px" height="36px" className="mr-2" />
              )}
              {isModal && <SkeletonLoader width="150px" height="28px" />}
            </div>
            {onClose && (
              <SkeletonLoader shape="circle" width="32px" height="32px" />
            )}
          </div>
        )}

        {/* Blog Content Skeleton */}
        <div>
          <div className="bg-gray-900 p-4 sm:p-6 md:p-8">
            <div className="gap-4 grid grid-cols-1 md:grid-cols-12">
              <div className="md:col-span-5 px-2 md:px-6 text-left md:text-right">
                <SkeletonLoader
                  width="80px"
                  height="28px"
                  className="mb-4 inline-block bg-gray-700"
                />
                <SkeletonLoader
                  height="36px"
                  className="mb-2 bg-gray-700 w-full"
                />
                <SkeletonLoader
                  height="30px"
                  className="mb-4 bg-gray-700 w-4/5"
                />
                <SkeletonLoader
                  height="20px"
                  className="mb-4 bg-gray-700 w-3/5"
                />
                <div className="flex justify-start md:justify-end items-center gap-4 mt-4">
                  <SkeletonLoader width="60px" height="20px" className="bg-gray-700" />
                  <SkeletonLoader width="60px" height="24px" className="bg-gray-700"/>
                </div>
                <SkeletonLoader
                  width="120px"
                  height="20px"
                  className="mt-4 bg-gray-700"
                />
              </div>
              <div className="md:col-span-7">
                <SkeletonLoader height="300px" className="bg-gray-800" />
              </div>
            </div>
          </div>

          {/* Owner actions skeleton (conditional) */}
          {isOwnerState && (
             <div className="flex justify-end items-center gap-2 p-4 sm:px-6 md:px-8">
                <SkeletonLoader width="100px" height="36px" />
                <SkeletonLoader width="110px" height="36px" />
            </div>
          )}

          <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-8 text-center">
              <SkeletonLoader height="24px" className="w-3/4 mx-auto" />
              <SkeletonLoader height="20px" className="w-1/2 mx-auto mt-2" />
            </div>

            <article className="max-w-none prose">
              <SkeletonLoader height="20px" className="w-full mb-2" />
              <SkeletonLoader height="20px" className="w-full mb-2" />
              <SkeletonLoader height="20px" className="w-5/6 mb-2" />
              <SkeletonLoader height="20px" className="w-full my-4" />
              <SkeletonLoader height="20px" className="w-full mb-2" />
              <SkeletonLoader height="20px" className="w-2/3 mb-2" />
            </article>

            <div className="flex flex-wrap items-center gap-3 mt-8 pt-4 border-t">
              <SkeletonLoader width="50px" height="20px" />
              <div className="flex flex-wrap gap-2">
                <SkeletonLoader width="60px" height="28px" />
                <SkeletonLoader width="70px" height="28px" />
                <SkeletonLoader width="50px" height="28px" />
              </div>
            </div>
          </div>
        </div>
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

  return (
    <>
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
            <div className="flex items-center gap-2">
              {onClose && (
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
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

          {/* Owner actions */}
          {isOwner && (
            <div className="flex justify-end items-center gap-2 p-4 sm:px-6 md:px-8">
              <Button
                variant="outline"
                onClick={handleEdit}
                className="flex items-center gap-1 hover:bg-[#003666] border-[#003666] text-[#003666] hover:text-white transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Blog
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="flex items-center gap-1 hover:bg-red-600 border-red-600 text-red-600 hover:text-white transition-colors"
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Deleting..." : "Delete Blog"}
              </Button>
            </div>
          )}

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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This action cannot be undone."
        itemType="blog"
      />
    </>
  );
};

export default BlogDetail;
