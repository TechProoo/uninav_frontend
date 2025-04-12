"use client";

import BlogGrid from "@/components/blog/BlogGrid";
import NoBlog from "@/components/blog/NoBlog";
import Button from "@/components/blog/Button-styled";
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
    router.push(`/blogs/${blog.id}`);
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
        <div className="mt-6">
          <BlogGrid
            blogs={blogs}
            onBlogClick={handleBlogClick}
            viewMode="grid"
          />

          {/* Pagination Controls */}
          {paginationData.totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!paginationData.hasPrev}
                  className={`px-3 py-1 rounded-md ${
                    paginationData.hasPrev
                      ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: paginationData.totalPages },
                    (_, i) => i + 1
                  )
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === paginationData.totalPages ||
                        (page >= currentPage - 1 && page <= currentPage + 1)
                    )
                    .map((page, index, array) => (
                      <React.Fragment key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 flex items-center justify-center rounded-md ${
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
                  className={`px-3 py-1 rounded-md ${
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
