"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Book from "../../../public/Image/bookOne.png";
import Image from "next/image";
import { useMaterialData } from "@/hooks/useMaterialData";
import { useAuth } from "@/contexts/authContext";
import BookmarkSlider from "@/components/materials/BookmarkSlider";
import MaterialGrid from "@/components/materials/MaterialGrid";

const Dashboard = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  const {
    recommendations,
    bookmarks,
    recommendationsMeta,
    bookmarksMeta,
    loading,
    error,
    fetchRecommendations,
    fetchBookmarks,
  } = useMaterialData();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    // Initial data fetch is handled inside useMaterialData hook
  }, [isAuthenticated, router]);

  // Handle page changes
  const handleRecommendationPageChange = (page: number) => {
    fetchRecommendations(page);
  };

  return (
    <div className="mx-auto container">
      {/* Welcome Banner */}
      <div className="flex md:flex-row flex-col justify-between items-center shadow-md mb-10 p-6 md:p-8 rounded-xl text-white dashboard_gr">
        <div className="flex flex-col items-center md:items-start space-y-4">
          <Image
            src={Book}
            alt="Books and Glasses"
            className="w-[200px] md:w-[220px]"
          />
        </div>

        <div className="max-w-xl md:text-left text-center">
          <h1 className="font-semibold text-2xl md:text-3xl fst">
            Hi, {user?.firstName || "Student"}
          </h1>
          <p className="mt-2 text-sm md:text-base">
            Welcome to UniNav, your trusted gateway to academic resources,
            connecting you with study materials, past questions, and peer
            support.
          </p>
          <button className="bg-white hover:bg-blue-100 shadow mt-4 px-6 py-2 rounded-full text-slate-600 transition fst">
            Browse All Materials
          </button>
        </div>

        <div className="hidden md:block">
          <Image src={Book} alt="Books on Shelf" width={250} height={250} />
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

      {/* Recommendations Section - Vertical Grid with Pagination */}
      <MaterialGrid
        title="Recommended Materials"
        materials={recommendations}
        loading={loading.recommendations}
        error={error.recommendations}
        currentPage={recommendationsMeta?.currentPage || 1}
        totalPages={recommendationsMeta?.totalPages || 1}
        onPageChange={handleRecommendationPageChange}
      />
    </div>
  );
};

export default Dashboard;
