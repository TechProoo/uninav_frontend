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
import { useSearchParams } from "next/navigation";
import { BadgeDemo } from "@/components/ui/BadgeUi";
import { SelectType } from "@/components/search/select";
import { SelectCourse } from "@/components/search/selectCourse";
import searchData from "@/api/search.api";
import { Material, Pagination, Response } from "@/lib/types/response.type";
import MaterialGrid from "@/components/materials/MaterialGrid";
// import { SearchResponse } from "@/lib/types/response.type";

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

  return (
    <div className="bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] px-6 py-6 min-h-screen text-gray-900">
      <Toaster />

      {/* Search Section */}
      <div className="bg-[#f0f8ff] shadow mt-10 p-6 rounded-xl">
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

        {/* Filters & Results Section */}
        <div className="gap-4 grid grid-cols-12 bg-white shadow-xl mt-10 p-6 md:p-10 rounded-2xl w-full">
          {/* Sidebar */}
          <div className="space-y-6 col-span-12 md:col-span-3 pr-6 border-gray-300 border-r">
            <h1 className="font-semibold text-gray-900 text-lg">
              Refine your search
            </h1>
            <div className="space-y-4 bg-gray-50 shadow-sm p-4 border border-gray-300 rounded-xl">
              <h2 className="font-semibold text-gray-900 text-lg">Blogs</h2>
              <BadgeDemo text="Category" />
              <div className="w-[100%]">
                <SelectType onChange={(val) => setType(val)} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter by tag"
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
              <h2 className="font-semibold text-gray-900 text-lg">Files</h2>
              <SelectCourse onChange={(val) => setCourse(val)} />
            </div>
          </div>

          {/* Content Display */}
          <div className="col-span-12 md:col-span-9 pl-6">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[60vh]">
                <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
              </div>
            ) : result?.data?.data?.length ? (
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
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
