"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Book from "../../../public/Image/bookOne.png";
import Image from "next/image";
import { useAuth } from "@/contexts/authContext";
import BookmarkSlider from "@/components/materials/BookmarkSlider";
import MaterialGrid from "@/components/materials/MaterialGrid";
import { getAllBookmarks } from "@/api/user.api";
import { Material, Bookmark, Pagination } from "@/lib/types/response.type";
import { fetchRecommendedMaterials } from "@/api/material.api";

const Dashboard = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // State for recommendations
  const [recommendations, setRecommendations] = useState<Material[]>([]);
  const [recommendationsPagination, setRecommendationsPagination] = useState<
    Pagination<Material[]>["pagination"]
  >({
    page: 1,
    total: 0,
    totalPages: 1,
    limit: 6,
    hasMore: false,
    hasPrev: false,
  });

  // State for bookmarks
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Loading and error states
  const [loading, setLoading] = useState({
    recommendations: true,
    bookmarks: true,
  });
  const [error, setError] = useState({
    recommendations: null as string | null,
    bookmarks: null as string | null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    fetchRecommendations();
    fetchBookmarks();
  }, [isAuthenticated, router]);

  // Fetch recommendations
  const fetchRecommendations = async (page = 1) => {
    setLoading((prev) => ({ ...prev, recommendations: true }));
    setError((prev) => ({ ...prev, recommendations: null }));

    try {
      const response = await fetchRecommendedMaterials({ page, limit: 6 });

      if (response?.data) {
        setRecommendations(response.data.data);

        // Update pagination state using the structure from response.type.ts
        if (response.data.pagination) {
          setRecommendationsPagination(response.data.pagination);
        }
      } else {
        setError((prev) => ({
          ...prev,
          recommendations: "Failed to fetch recommendations",
        }));
      }
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setError((prev) => ({
        ...prev,
        recommendations: "Error fetching recommendations",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, recommendations: false }));
    }
  };

  // Fetch bookmarks
  const fetchBookmarks = async () => {
    setLoading((prev) => ({ ...prev, bookmarks: true }));
    setError((prev) => ({ ...prev, bookmarks: null }));

    try {
      const bookmarkData = await getAllBookmarks();

      if (bookmarkData && Array.isArray(bookmarkData)) {
        setBookmarks(bookmarkData);
      } else {
        setError((prev) => ({
          ...prev,
          bookmarks: "Failed to fetch bookmarks",
        }));
      }
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      setError((prev) => ({ ...prev, bookmarks: "Error fetching bookmarks" }));
    } finally {
      setLoading((prev) => ({ ...prev, bookmarks: false }));
    }
  };

  // Handle page changes
  const handleRecommendationPageChange = (page: number) => {
    fetchRecommendations(page);
  };

  return (
    <div className="">
      {/* Welcome Banner */}
      <div className="flex md:flex-row flex-col justify-between items-center shadow-md mb-10 p-6 md:p-8 rounded-xl text-white dashboard_gr space-y-6 md:space-y-0 w-[auto]">
        {/* Left Image */}
        <div className="md:w-1/3 w-full flex justify-center md:justify-start">
          <Image
            src={Book}
            alt="Books and Glasses"
            className="w-[150px] sm:w-[180px] md:w-[220px] object-contain"
          />
        </div>

        {/* Text Section */}
        <div className="md:w-1/2 w-full text-center md:text-left">
          <h1 className="font-semibold text-2xl md:text-3xl fst">
            Hi, {user?.firstName || "Student"}
          </h1>
          <p className="mt-2 text-sm md:text-base">
            Welcome to UniNav, your trusted gateway to academic resources...
          </p>
          <button className="bg-white hover:bg-blue-100 shadow mt-4 px-6 py-2 rounded-full text-slate-600 transition fst">
            Browse All Materials
          </button>
        </div>

        {/* Right-side image */}
        <div className="hidden md:block md:w-1/4">
          <Image src={Book} alt="Books on Shelf" width={200} height={200} />
        </div>
      </div>

      {/* Bookmarks Section - Horizontal Slider */}
      <section className="mb-8">
        <h2 className="mb-4 font-semibold text-2xl">Your Bookmarks</h2>
        <BookmarkSlider
          bookmarks={bookmarks}
          loading={loading.bookmarks}
          error={error.bookmarks}
        />
      </section>

      <MaterialGrid
        title="Recommended Materials"
        materials={recommendations}
        loading={loading.recommendations}
        error={error.recommendations}
        currentPage={recommendationsPagination.page}
        totalPages={recommendationsPagination.totalPages}
        onPageChange={handleRecommendationPageChange}
      />
    </div>
  );
};

export default Dashboard;
