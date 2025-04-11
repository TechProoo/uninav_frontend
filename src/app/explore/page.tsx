"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  MoveRight,
  Settings,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useSearchParams } from "next/navigation";
import { BadgeDemo } from "@/components/ui/BadgeUi";
import { SelectType } from "@/components/search/select";
import { SelectCourse } from "@/components/search/selectCourse";
import searchData from "@/api/search.api";
import {
  Blog,
  BlogResponse,
  Material,
  Pagination,
  Response,
} from "@/lib/types/response.type";
import MaterialGrid from "@/components/materials/MaterialGrid";
import allBlog from "@/api/allBlog";
import BlogCard from "@/components/blog/blogCard";

const Page = () => {
  const searchParams = useSearchParams();
  const value = searchParams.get("value");
  const [inputValue, setInputValue] = useState<string | null>(value);
  const [tags, setTags] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [course, setCourse] = useState<string>("");
  const [result, setResult] = useState<Response<Pagination<Material[]>>>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allBlogs, setAllBlogs] = useState<BlogResponse | null>(null);

  useEffect(() => {
    const search = async () => {
      setIsLoading(true);
      try {
        const response = await searchData({
          query: value,
          tag: tags,
          courseId: course,
          type,
          page,
        });

        if (response.status === "success") {
          setResult(response);
          const total = response.data.pagination?.totalPages || 1;
          setTotalPages(total);
        }

        if (response.status === "error") toast.error("Failed to fetch results");
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setIsLoading(false);
      }
    };
    search();
  }, [value, course, type, tags, page]);

  useEffect(() => {
    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const blogs = await allBlog();
        console.log(blogs);
        if (blogs) {
          setAllBlogs(blogs);
        }
      } catch (err) {
        console.error("Error fetching Blogs", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, []);

  const handleSearch = async () => {
    setPage(1);
    setIsLoading(true);
    try {
      const response = await searchData({
        query: inputValue,
        tag: tags,
        courseId: course,
        type,
        page: 1,
      });

      if (response.status === "success") {
        setResult(response);
        const total = response.data.pagination?.totalPages || 1;
        setTotalPages(total);
      }

      if (response.status === "error") toast.error("Failed to fetch results");
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaterialClick = (material: Material) => {
    // Navigate to material detail page or open a modal
    window.location.href = `/material/${material.id}`;
  };

  if (allBlogs?.data.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center mt-20 space-y-6">
        <h1 className="text-4xl font-semibold text-gray-700">
          No blogs available
        </h1>
        <p className="text-lg text-gray-500">
          It looks like there aren't any blogs right now. Please check back
          later!
        </p>
        <div className="w-16 h-16 border-4 border-t-4 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] px-6 py-6 min-h-screen text-gray-900">
      <Toaster />

      {/* Search Section */}
      <div className="bg-[#f0f8ff] shadow rounded-xl">
        {value && (
          <div className="flex sm:flex-row flex-col gap-4 w-full">
            <input
              type="text"
              value={inputValue || ""}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Search for study materials, courses..."
              className="bg-white/10 backdrop-blur-md px-5 py-3 border-[#0036669c] border-2 focus:border-[#f0f8ff] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003666] w-full text-[#003666] transition-all duration-300 placeholder-gray-300"
            />
            <button
              onClick={handleSearch}
              className="bg-[#003666] hover:bg-[#003666d2] shadow-md px-6 py-3 rounded-xl w-full sm:w-auto font-semibold text-white transition-all duration-300"
            >
              Search
            </button>
          </div>
        )}

        {/* Filters & Results Section */}
        <div className="gap-4 grid grid-cols-12 bg-white shadow-xl mt-10 p-6 md:p-10 rounded-2xl w-full">
          {/* Sidebar */}
          <div className="space-y-6  col-span-12 md:col-span-3 pr-6 border-gray-300 border-r">
            <div className="sticky top-10 space-y-6 ">
              <h1 className="font-semibold text-gray-900 text-lg">
                {value
                  ? "Refine your search results"
                  : "Discover blogs and materials tailored for you"}
              </h1>
              <div className="space-y-4 bg-gray-50 shadow-sm p-4 border border-gray-300 rounded-xl">
                <BadgeDemo text="Filter By:" />
                <div className="w-[100%]">
                  <SelectType onChange={(val) => setType(val)} />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder=" tag"
                    onChange={(e) => setTags(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-[100%] text-gray-800 placeholder:text-gray-500"
                  />
                  <button
                    onClick={handleSearch}
                    className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg text-white transition"
                  >
                    <MoveRight size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-4 bg-gray-50 shadow-sm p-4 border border-gray-300 rounded-xl">
                <h2 className="font-semibold text-gray-900 text-lg">Courses</h2>
                <SelectCourse onChange={(val) => setCourse(val)} />
              </div>
            </div>
          </div>

          {/* Content Display */}
          <div className="col-span-12 md:col-span-9 pl-6">
            <Tabs defaultValue="materials" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="materials">Material</TabsTrigger>
                <TabsTrigger value="blogs">Blogs</TabsTrigger>
              </TabsList>
              {isLoading ? (
                <div className="flex justify-center items-center min-h-[60vh]">
                  <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
                </div>
              ) : (
                <>
                  <TabsContent value="materials">
                    {result?.data?.data?.length ? (
                      <div className="space-y-6">
                        <MaterialGrid
                          materials={result.data.data}
                          onMaterialClick={handleMaterialClick}
                          viewMode="list"
                        />

                        {/* Pagination Controls */}
                        <div className="flex justify-end items-center gap-4 mt-8">
                          <p className="text-gray-600">Page {page}</p>
                          <button
                            onClick={() =>
                              setPage((prev) => Math.max(prev - 1, 1))
                            }
                            disabled={page === 1}
                            className={`border px-4 py-2 rounded-md transition ${
                              page === 1
                                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                : "text-blue-600 border-blue-500 hover:bg-blue-50"
                            }`}
                          >
                            Prev
                          </button>
                          <button
                            onClick={() =>
                              setPage((prev) => Math.min(prev + 1, totalPages))
                            }
                            disabled={page === totalPages}
                            className={`border px-4 py-2 rounded-md transition ${
                              page === totalPages
                                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                                : "text-blue-600 border-blue-500 hover:bg-blue-50"
                            }`}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600">No results found.</p>
                    )}
                  </TabsContent>
                  <TabsContent value="blogs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
                      {allBlogs?.data.map((blog: Blog) => (
                        <BlogCard key={blog.id} data={blog} />
                      ))}{" "}
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
