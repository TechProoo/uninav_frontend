"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Logo from "../../../public/Image/logoo.png";
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
// import { SearchResponse } from "@/lib/types/response.type";

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Materials",
    url: "/dashboard/materials",
    icon: BookOpen,
  },
  {
    title: "Courses",
    url: "/dashboard/courses",
    icon: GraduationCap,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-gray-900 px-6 py-6">
      <Toaster />
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 bg-white rounded-xl shadow px-4 py-2">
          <Image src={Logo} alt="Logo" className="w-36 h-auto" />
        </div>

        <ul className="flex flex-wrap gap-4 text-sm md:text-base">
          {items.map((item) => (
            <li key={item.url}>
              <Link
                href={item.url}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-gray-800 transition"
              >
                <item.icon size={18} />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Search Section */}
      <div className="mt-10 bg-[#f0f8ff] p-6 rounded-xl shadow">
        <div className="w-full flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={inputValue || ""}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search for study materials, courses..."
            className="w-full text-[#003666] px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md placeholder-gray-300 border-2 border-[#0036669c] focus:outline-none focus:ring-2 focus:ring-[#003666] focus:border-[#f0f8ff] transition-all duration-300"
          />
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#003666] hover:bg-[#003666d2] transition-all duration-300 text-white font-semibold shadow-md"
          >
            Search
          </button>
        </div>

        {/* Filters & Results Section */}
        <div className="grid grid-cols-12 w-full gap-4 mt-10 bg-white rounded-2xl p-6 md:p-10 shadow-xl">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3 space-y-6 border-r border-gray-300 pr-6">
            <h1 className="text-gray-900 text-lg font-semibold">
              Refine your search
            </h1>
            <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 space-y-4 shadow-sm">
              <h2 className="text-gray-900 text-lg font-semibold">Blogs</h2>
              <BadgeDemo text="Category" />
              <div className="w-[100%]">
                <SelectType onChange={(val) => setType(val)} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Filter by tag"
                  onChange={(e) => setTags(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 text-gray-800 px-4 w-[100%] py-2 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSearch}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  <MoveRight size={20} />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-300 rounded-xl p-4 space-y-4 shadow-sm">
              <h2 className="text-gray-900 text-lg font-semibold">Files</h2>
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
                {result.data.data.map((material: any) => (
                  <div
                    key={material.id}
                    className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {material.label}
                      </h2>
                      <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded-full capitalize">
                        {material.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{material.description}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {material.tags.map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-500">
                      <p>
                        <strong>Course:</strong>{" "}
                        {material.targetCourseInfo?.courseName} (
                        {material.targetCourseInfo?.courseCode})
                      </p>
                      <p>
                        <strong>Uploaded by:</strong>{" "}
                        {material.creator?.firstName}{" "}
                        {material.creator?.lastName} (@
                        {material.creator?.username})
                      </p>
                    </div>
                  </div>
                ))}

                {/* Pagination Controls */}
                <div className="flex items-center justify-end gap-4 mt-8">
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
