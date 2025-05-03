"use client";

import BlogGrid from "@/components/blog/BlogGrid";
import NoBlog from "@/components/blog/NoBlog";
import { ThemeButton } from "@/components/ui/ThemeButton";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "../loading";
import { Blog } from "@/lib/types/response.type";
import { deleteBlog, getUserBlogs } from "@/api/blog.api";

const BlogsPage = () => {
  const router = useRouter();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(9);
  const [paginationData, setPaginationData] = useState<{
    total: number;
    totalPages: number;
    hasMore: boolean;
    hasPrev: boolean;
  }>({
    total: 0,
    totalPages: 0,
    hasMore: false,
    hasPrev: false,
  });

  const fetchBlogs = async (page: number = 1, limit: number = 9) => {
    try {
      setIsLoading(true);
      const response = await getUserBlogs({ page, limit });

      if (response.data.data) {
        setBlogs(response.data.data);
        setPaginationData({
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
          hasMore: response.data.pagination.hasMore,
          hasPrev: response.data.pagination.hasPrev,
        });
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleBlogClick = (blog: Blog) => {
    router.push(`/blog/${blog.id}`);
  };

  const handleDelete = async (postId: string) => {
    try {
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== postId));
      await deleteBlog(postId);

      // If after deletion the page becomes empty and there are previous pages, go back one page
      if (blogs.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        // Refresh current page to update after deletion
        fetchBlogs(currentPage, pageSize);
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  if (isLoading && blogs.length === 0) return <Loader />;
  if (!blogs || blogs.length === 0) return <NoBlog />;

  return (
    <div className="px-2 sm:px-4 w-full">
      <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6 w-full">
        <h1 className="section-heading">Manage Blogs</h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <ThemeButton
            text="All Blogs"
            onClick={() => handleNavigation("/explore?defaultTab=blogs")}
            className="px-3 sm:px-4 py-1.5 sm:py-2 h-auto text-xs sm:text-sm"
          />
          <ThemeButton
            text="Create Blog"
            onClick={() => handleNavigation("/dashboard/blogs/createblog")}
            className="px-3 sm:px-4 py-1.5 sm:py-2 h-auto text-xs sm:text-sm"
          />
        </div>
      </div>

      <div className="mt-4 sm:mt-6 md:mt-10">
        <h2 className="font-bold text-lg sm:text-xl md:text-2xl fst">
          Your Blogs
        </h2>
        <div className="mt-4 sm:mt-6">
          <BlogGrid
            blogs={blogs}
            onBlogClick={handleBlogClick}
            viewMode="grid"
          />

          {/* Pagination Controls */}
          {paginationData.totalPages > 1 && (
            <div className="flex justify-center mt-6 sm:mt-8">
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!paginationData.hasPrev}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
                    paginationData.hasPrev
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers - Simplified for Mobile */}
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: paginationData.totalPages },
                    (_, i) => i + 1
                  )
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === paginationData.totalPages ||
                        (page >=
                          currentPage - (window.innerWidth < 640 ? 0 : 1) &&
                          page <=
                            currentPage + (window.innerWidth < 640 ? 0 : 1))
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-1 sm:px-2 text-xs sm:text-sm">
                            ...
                          </span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-md text-xs sm:text-sm ${
                            currentPage === page
                              ? "bg-blue-600 text-white"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          }`}
                        >
                          {page}
                        </button>
                      </React.Fragment>
                    ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!paginationData.hasMore}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-md text-xs sm:text-sm ${
                    paginationData.hasMore
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
