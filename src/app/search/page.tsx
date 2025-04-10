"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
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
// import { Badge } from "@/components/ui/badge";
import { BadgeDemo } from "@/components/ui/BadgeUi";
import { SelectDemo } from "@/components/search/select";
import { SelectCourse } from "@/components/search/selectCourse";
import searchData from "@/api/search.api";
import { SearchResponse } from "@/lib/types/response.type";
import { Toaster } from "react-hot-toast";

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
  const [result, setResult] = useState<SearchResponse>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const search = async () => {
      setIsLoading(false);
      try {
        setIsLoading(true);
        const response = await searchData({
          query: value,
          tag: tags,
          courseId: course,
          type: type,
        });

        if (response.status === "success") {
          setResult(response);
        }

        if (response.status === "error") {
          toast.success("Post submitted successfully");
        }
        console.log(response.data)
      } catch (err) {
        console.error("Error fetching data", err);
      } finally {
        setIsLoading(false);
      }
    };
    search();
  }, [value, course, type, tags]);

  const handleSearch = async () => {
    setIsLoading(false);
    try {
      setIsLoading(true);
      const response = await searchData({
        query: inputValue,
        tag: tags,
        courseId: course,
        type: type,
      });

      if (response.status === "success") {
        setResult(response);
      }

      if (response.status === "error") {
        toast.error("Failed to fetch results");
      }
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white px-8 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2 bg-white rounded-xl">
          <Image src={Logo} alt="Logo" className="w-36 h-auto drop-shadow-lg" />
        </div>

        {/* Nav Links */}
        <ul className="flex flex-wrap gap-6 text-sm md:text-base">
          {items.map((item) => (
            <li key={item.url}>
              <Link
                href={item.url}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1e40af]/10 hover:bg-[#1e40af]/20 transition duration-300 ease-in-out hover:scale-105 text-slate-200 hover:text-white"
              >
                <item.icon size={18} />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="m-3 mt-10 rounded-lg bg-[#f0f8ff] md:p-10 p-2">
        <div className="mt-10 ">
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
        </div>
        <div className="flex gap-2 mt-10  bg-white/5 rounded-xl p-6 md:p-10 shadow-lg">
          <div>
            <h1 className="text_dark text-lg fst">Refine your search</h1>
            <div className="mt-5">
              <h1>Blogs</h1>
              <BadgeDemo text="Category" />
              <SelectDemo onChange={(val) => setType(val)} />
              <div>
                <input
                  type="text"
                  placeholder="#"
                  onChange={(e) => setTags(e.target.value)}
                  className="tags"
                />
                <MoveRight onClick={handleSearch} />
              </div>
            </div>
            <div className="mt-5">
              <h1>Files</h1>
              <SelectCourse onChange={(val) => setCourse(val)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
