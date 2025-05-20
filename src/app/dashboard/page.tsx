"use client";

import React, { useEffect, useState, KeyboardEvent } from "react";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Book from "../../../public/Image/bookOne.png";
import { Material, Bookmark } from "@/lib/types/response.type";
import { getAllBookmarks } from "@/api/user.api";
import { fetchRecommendedMaterials } from "@/api/material.api";
import MaterialGrid from "@/components/materials/MaterialGrid";
import CourseSlider from "@/components/dashboard/CourseSlider";
import BookmarkSlider from "@/components/materials/BookmarkSlider";
import { Search } from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  // State for recommendations
  const [recommendations, setRecommendations] = useState<Material[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loadingState, setLoadingState] = useState({
    recommendations: true,
    bookmarks: true,
  });
  const [error, setError] = useState({
    recommendations: null as string | null,
    bookmarks: null as string | null,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  // Fetch recommendations and bookmarks
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recommendationsRes, bookmarksRes] = await Promise.all([
          fetchRecommendedMaterials({ page: 1, limit: 6 }),
          getAllBookmarks(),
        ]);

        if (recommendationsRes?.status === "success") {
          setRecommendations(recommendationsRes.data.data);
        }

        if (bookmarksRes) {
          setBookmarks(bookmarksRes);
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoadingState({
          recommendations: false,
          bookmarks: false,
        });
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/explore?query=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  const handleMaterialClick = (material: Material) => {
    router.push(`/material/${material.id}`);
  };

  // Filter materials based on search query
  const filteredMaterials = recommendations.filter(
    (material) =>
      (material.label?.toLowerCase() || "").includes(
        filterQuery.toLowerCase()
      ) ||
      (material.description?.toLowerCase() || "").includes(
        filterQuery.toLowerCase()
      ) ||
      (material.targetCourse?.courseName?.toLowerCase() || "").includes(
        filterQuery.toLowerCase()
      )
  );

  if (loading || !user) {
    return null;
  }

  return (
    <div className="flex-grow w-full m-screen">
      <div className="space-y-8 mx-auto px-4 py-2 max-w-7xl">
        {/* Welcome Banner with Search */}
        <div className="flex md:flex-row flex-col justify-between items-center shadow-md mb-10 p-4 md:p-8 rounded-xl text-white dashboard_gr">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <Image
              src={Book}
              alt="Books and Glasses"
              className="w-[100px] md:w-[120px]"
            />
          </div>

          <div className="max-w-xl md:text-left text-center">
            <h1 className="font-semibold text-white text-2xl md:text-3xl">
              Hi, {user?.firstName || "Student"}
            </h1>
            <p className="mt-2 text-sm md:text-base">
              Welcome to UniNav, your trusted gateway to academic resources,
              connecting you with study materials, past questions, and peer
              support.
            </p>

            {/* Search Bar - Improved for mobile */}
            <div className="flex mx-auto md:mx-0 mt-4 w-full max-w-md">
              <div className="relative flex-1">
                <Search className="top-1/2 left-3 absolute w-5 h-5 text-slate-600 -translate-y-1/2 transform" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Search for materials..."
                  className="bg-white px-10 py-2 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-200 w-full text-slate-800"
                />
              </div>
              {/* Show button on all screen sizes with responsive styling */}
              <button
                onClick={handleSearch}
                className="flex justify-center items-center bg-[#003666] hover:bg-[#0036669f] px-3 sm:px-6 py-2 rounded-r-full min-w-[40px] text-slate-600 text-white transition"
                aria-label="Search"
              >
                <Search className="sm:hidden w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>

          <div className="hidden md:block">
            <Image src={Book} alt="Books on Shelf" width={100} height={100} />
          </div>
        </div>

        {/* Course Slider */}
        <CourseSlider />

        {/* Bookmarks Section */}
        <section className="mb-8">
          <h2 className="section-heading">Your Bookmarks</h2>
          <BookmarkSlider
            bookmarks={bookmarks}
            loading={loadingState.bookmarks}
            error={error.bookmarks}
          />
        </section>

        {/* Recommendations Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-heading">Recommended Materials</h2>
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Filter materials..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
          <MaterialGrid
            materials={filteredMaterials}
            onMaterialClick={handleMaterialClick}
            viewMode="grid"
          />
        </section>
      </div>
    </div>
  );
}
