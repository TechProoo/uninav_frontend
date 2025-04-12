"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import {
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  Trash2,
  CheckCircle,
  XCircle,
  Tag,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ApprovalStatusEnum, Blog } from "@/lib/types/response.type";
import {
  listBlogReviews,
  reviewBlog,
  deleteBlogAsAdmin,
  ReviewActionDTO,
  getBlogReviewCounts,
  ReviewCounts,
} from "@/api/review.api";
import ReviewTabs from "@/components/management/ReviewTabs";
import ReviewActionDialog from "@/components/management/ReviewActionDialog";
import DeleteConfirmationDialog from "@/components/management/DeleteConfirmationDialog";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import BlogDetail from "@/components/blog/BlogDetail";

const BlogsReviewPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>(
    ApprovalStatusEnum.PENDING
  );
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [viewingBlogId, setViewingBlogId] = useState<string | null>(null);

  // Dialog states
  const [reviewAction, setReviewAction] = useState<ApprovalStatusEnum | null>(
    null
  );
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Counters for tabs
  const [counts, setCounts] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Redirect if not admin or moderator
  useEffect(() => {
    if (user && user.role !== "admin" && user.role !== "moderator") {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Fetch blogs when tab changes or pagination changes
  useEffect(() => {
    fetchBlogs();
  }, [activeTab, currentPage]);

  // Fetch counts using new endpoint
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await getBlogReviewCounts();
        if (response?.status === "success") {
          setCounts(response.data);
        }
      } catch (err) {
        console.error("Error fetching counts:", err);
      }
    };

    fetchCounts();
  }, []); // Only fetch once on mount

  const fetchBlogs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await listBlogReviews({
        status: activeTab as ApprovalStatusEnum,
        page: currentPage,
        limit: 6,
        query: searchQuery || undefined,
      });

      if (response?.status === "success") {
        setBlogs(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      } else {
        setError("Failed to load blogs");
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("An error occurred while loading blogs");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1); // Reset to first page on tab change
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchBlogs();
  };

  const handleReviewAction = (blog: Blog, action: ApprovalStatusEnum) => {
    setSelectedBlog(blog);
    setReviewAction(action);
  };

  const handleDeleteAction = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsDeleteDialogOpen(true);
  };

  const confirmReviewAction = async (
    action: ApprovalStatusEnum,
    comment: string
  ) => {
    if (!selectedBlog) return;

    try {
      const reviewData: ReviewActionDTO = {
        action,
        comment: comment.trim() || undefined,
      };

      const response = await reviewBlog(selectedBlog.id, reviewData);

      if (response?.status === "success") {
        toast.success(
          `Blog has been ${
            action === ApprovalStatusEnum.APPROVED ? "approved" : "rejected"
          }`
        );

        // Update counts locally
        setCounts((prev) => ({
          ...prev,
          pending: Math.max(0, prev.pending - 1),
          [action === ApprovalStatusEnum.APPROVED ? "approved" : "rejected"]:
            prev[
              action === ApprovalStatusEnum.APPROVED ? "approved" : "rejected"
            ] + 1,
        }));

        fetchBlogs();
      } else {
        toast.error("Action failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during review action:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const confirmDelete = async () => {
    if (!selectedBlog || user?.role !== "admin") return;

    try {
      const response = await deleteBlogAsAdmin(selectedBlog.id);

      if (response?.status === "success") {
        toast.success("Blog has been deleted");

        // Update counts based on current tab
        setCounts((prev) => ({
          ...prev,
          [activeTab.toLowerCase()]: Math.max(
            0,
            prev[activeTab.toLowerCase() as keyof ReviewCounts] - 1
          ),
        }));

        fetchBlogs();
      } else {
        toast.error("Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      toast.error("An error occurred while deleting blog");
    }
  };

  // Format blog type for display
  const formatBlogType = (type: string) => {
    return type
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleBlogClick = (blog: Blog) => {
    setViewingBlogId(blog.id);
  };

  // If user not loaded yet or not admin/moderator, show nothing
  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return null;
  }

  return (
    <div className="mx-auto px-4 container">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-2" asChild>
          <Link href="/dashboard/management">
            <ChevronLeft className="w-5 h-5" />
            <span>Back</span>
          </Link>
        </Button>
        <h1 className="font-bold text-3xl">Blogs Review</h1>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="search"
            placeholder="Search blogs by title, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
          <Button type="submit">
            <Search className="mr-2 w-4 h-4" />
            Search
          </Button>
        </form>
      </div>

      <ReviewTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        pendingCount={counts.pending}
        approvedCount={counts.approved}
        rejectedCount={counts.rejected}
      >
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded-md text-red-500">
              <p>{error}</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="bg-gray-50 p-8 rounded-md text-center">
              <FileText className="mx-auto mb-4 w-12 h-12 text-gray-400" />
              <h3 className="mb-2 font-medium text-xl">No blogs found</h3>
              <p className="text-gray-500">
                {activeTab === ApprovalStatusEnum.PENDING
                  ? "There are no blogs waiting for review."
                  : activeTab === ApprovalStatusEnum.APPROVED
                  ? "There are no approved blogs."
                  : "There are no rejected blogs."}
              </p>
            </div>
          ) : (
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white shadow-sm hover:shadow-md border rounded-lg overflow-hidden transition-shadow cursor-pointer"
                  onClick={() => handleBlogClick(blog)}
                >
                  {/* Blog Image */}
                  <div className="relative bg-gray-100 w-full aspect-video overflow-hidden">
                    {blog.headingImageAddress ? (
                      <img
                        src={blog.headingImageAddress}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "/Image/blank-book-cover-white-vector-illustration.png"; // Fallback image
                        }}
                      />
                    ) : (
                      <div className="flex justify-center items-center bg-gray-100 h-full">
                        <FileText className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                    <div className="top-2 right-2 absolute">
                      <Badge className="bg-blue-500 capitalize">
                        {formatBlogType(blog.type)}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Blog Title and Author */}
                    <h3 className="mb-1 font-semibold text-lg line-clamp-1">
                      {blog.title}
                    </h3>
                    <p className="mb-2 text-gray-500 text-sm">
                      by {blog.creator.firstName} {blog.creator.lastName}
                    </p>

                    {activeTab !== ApprovalStatusEnum.PENDING &&
                      blog.reviewedBy && (
                        <div className="bg-gray-50 mt-4 p-3 rounded-md">
                          <p className="font-medium text-sm">
                            {activeTab === ApprovalStatusEnum.APPROVED ? (
                              <span className="text-green-600">
                                Approved by:{" "}
                              </span>
                            ) : (
                              <span className="text-red-600">
                                Rejected by:{" "}
                              </span>
                            )}
                            {"@" + blog.reviewedBy.username}
                          </p>
                          {blog.reviewStatus ===
                            ApprovalStatusEnum.REJECTED && (
                            <p className="mt-1 text-sm line-clamp-2">
                              <span className="font-medium">Reason: </span>
                              {
                                "Comment not available in current data structure"
                              }
                            </p>
                          )}
                        </div>
                      )}

                    {/* Description */}
                    <p className="mb-3 text-gray-700 text-sm line-clamp-2">
                      {blog.description || "No description provided."}
                    </p>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {blog.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {blog.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{blog.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex items-center mb-4 text-gray-500 text-xs">
                      <span className="mr-3">Views: {blog.views}</span>
                      <span>Likes: {blog.likes}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      {activeTab === ApprovalStatusEnum.PENDING && (
                        <>
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReviewAction(
                                blog,
                                ApprovalStatusEnum.APPROVED
                              );
                            }}
                          >
                            <CheckCircle className="mr-1 w-3.5 h-3.5" />
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReviewAction(
                                blog,
                                ApprovalStatusEnum.REJECTED
                              );
                            }}
                          >
                            <XCircle className="mr-1 w-3.5 h-3.5" />
                            Reject
                          </Button>
                        </>
                      )}

                      {/* Delete button for admin only */}
                      {user.role === "admin" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAction(blog);
                          }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination controls */}
          {blogs.length > 0 && (
            <div className="flex justify-between items-center pt-8">
              <p className="text-gray-600">
                Page {currentPage} of {totalPages}
              </p>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="mr-1 w-4 h-4" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </ReviewTabs>

      {/* Blog detail modal */}
      {viewingBlogId && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 p-4">
          <div className="bg-white shadow-xl rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <BlogDetail
              blogId={viewingBlogId}
              onClose={() => setViewingBlogId(null)}
            />
          </div>
        </div>
      )}

      {/* Review action dialog */}
      {selectedBlog && reviewAction && (
        <ReviewActionDialog
          isOpen={!!reviewAction}
          onClose={() => setReviewAction(null)}
          onConfirm={confirmReviewAction}
          action={reviewAction}
          contentType="Blog"
        />
      )}

      {/* Delete confirmation dialog */}
      {selectedBlog && (
        <DeleteConfirmationDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          contentType="Blog"
          itemName={selectedBlog.title}
        />
      )}
    </div>
  );
};

export default BlogsReviewPage;
