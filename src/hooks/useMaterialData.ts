"use client";

import { useState, useEffect } from "react";
import { Material, Bookmark } from "@/lib/types/response.type";
import { getAllBookmarks } from "@/api/user.api";
import { getMaterials } from "@/api/material.api";

interface Meta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export function useMaterialData() {
  // State for recommendations
  const [recommendations, setRecommendations] = useState<Material[]>([]);
  const [recommendationsMeta, setRecommendationsMeta] = useState<Meta | null>(
    null
  );

  // State for bookmarks - using the correct Bookmark type
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [bookmarksMeta, setBookmarksMeta] = useState<Meta | null>(null);

  // Loading and error states
  const [loading, setLoading] = useState({
    recommendations: true,
    bookmarks: true,
  });
  const [error, setError] = useState({
    recommendations: null as string | null,
    bookmarks: null as string | null,
  });

  // Fetch recommendations
  const fetchRecommendations = async (page = 1) => {
    setLoading((prev) => ({ ...prev, recommendations: true }));
    setError((prev) => ({ ...prev, recommendations: null }));

    try {
      const response = await getMaterials({ page, limit: 6 });

      if (response?.data) {
        setRecommendations(response.data);
        setRecommendationsMeta({
          currentPage: response.meta?.currentPage || 1,
          totalPages: response.meta?.totalPages || 1,
          totalItems: response.meta?.totalItems || 0,
        });
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

  // Fetch bookmarks - now properly handling the Bookmark type
  const fetchBookmarks = async () => {
    setLoading((prev) => ({ ...prev, bookmarks: true }));
    setError((prev) => ({ ...prev, bookmarks: null }));

    try {
      const bookmarkData = await getAllBookmarks();

      if (bookmarkData && Array.isArray(bookmarkData)) {
        // Store the bookmarks directly without transforming
        setBookmarks(bookmarkData);
        setBookmarksMeta({
          currentPage: 1,
          totalPages: 1,
          totalItems: bookmarkData.length,
        });
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

  // Initial data fetch
  useEffect(() => {
    fetchRecommendations();
    fetchBookmarks();
  }, []);

  return {
    recommendations,
    bookmarks,
    recommendationsMeta,
    bookmarksMeta,
    loading,
    error,
    fetchRecommendations,
    fetchBookmarks,
  };
}
