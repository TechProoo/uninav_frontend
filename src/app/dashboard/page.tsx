"use client";

import React, { useEffect, useState } from "react";
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

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();

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

  if (loading || !user) {
    return null;
  }

  const handleMaterialClick = (material: Material) => {
    router.push(`/dashboard/materials/${material.id}`);
  };

  return (
    <div className="space-y-8 mx-auto px-4 py-8 container">
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
            <button
              onClick={() => router.push("/dashboard/materials")}
              className="bg-white hover:bg-blue-100 shadow mt-4 px-6 py-2 rounded-full text-slate-600 transition fst"
            >
              Browse All Materials
            </button>
          </div>

          <div className="hidden md:block">
            <Image src={Book} alt="Books on Shelf" width={250} height={250} />
          </div>
        </div>
      </div>

      {/* Course Slider */}
      <CourseSlider />

      {/* Bookmarks Section */}
      <section className="mb-8">
        <h2 className="mb-4 font-semibold text-xl sm:text-2xl">
          Your Bookmarks
        </h2>
        <BookmarkSlider
          bookmarks={bookmarks}
          loading={loadingState.bookmarks}
          error={error.bookmarks}
        />
      </section>

      {/* Recommendations Section */}
      <section className="mb-8">
        <h2 className="mb-4 font-semibold text-2xl">Recommended Materials</h2>
        <MaterialGrid
          materials={recommendations}
          onMaterialClick={handleMaterialClick}
          view="grid"
        />
      </section>
    </div>
  );
}
