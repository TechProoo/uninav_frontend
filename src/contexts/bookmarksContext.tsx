"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Bookmark, Material } from "@/lib/types/response.type";
import {
  getAllBookmarks,
  createBookmark,
  deleteBookmark,
} from "@/api/user.api";
import { useAuth } from "./authContext";
import { toast } from "react-hot-toast";

interface BookmarksContextType {
  bookmarks: Bookmark[];
  isLoading: boolean;
  error: string | null;
  isBookmarked: (materialId: string) => boolean;
  toggleBookmark: (material: Material) => Promise<void>;
  refreshBookmarks: () => Promise<void>;
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(
  undefined
);

export const BookmarksProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllBookmarks();
      if (data) {
        setBookmarks(data);
      }
    } catch (err) {
      setError("Failed to fetch bookmarks");
      console.error("Error fetching bookmarks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    }
  }, [user]);

  const isBookmarked = (materialId: string): boolean => {
    return bookmarks.some((bookmark) => bookmark.materialId === materialId);
  };

  const toggleBookmark = async (material: Material) => {
    try {
      const existingBookmark = bookmarks.find(
        (bookmark) => bookmark.materialId === material.id
      );

      if (existingBookmark) {
        // Optimistic update - remove from state immediately
        setBookmarks((prev) =>
          prev.filter((bookmark) => bookmark.id !== existingBookmark.id)
        );

        try {
          await deleteBookmark(existingBookmark.id);
          toast.success("Removed from bookmarks");
        } catch (error) {
          // Revert optimistic update on error
          setBookmarks((prev) => [...prev, existingBookmark]);
          toast.error("Failed to remove bookmark");
          throw error;
        }
      } else {
        // Create optimistic bookmark
        const optimisticBookmark: Bookmark = {
          id: `temp-${Date.now()}`, // Temporary ID
          materialId: material.id,
          userid: user?.id || "",
          material: material,
          createdAt: new Date().toISOString(),
        };

        // Optimistic update - add to state immediately
        setBookmarks((prev) => [...prev, optimisticBookmark]);

        try {
          const newBookmark = await createBookmark({
            materialId: material.id,
          });
          if (newBookmark) {
            // Replace optimistic bookmark with real one
            setBookmarks((prev) =>
              prev.map((bookmark) =>
                bookmark.id === optimisticBookmark.id ? newBookmark : bookmark
              )
            );
            toast.success("Added to bookmarks");
          }
        } catch (error) {
          // Revert optimistic update on error
          setBookmarks((prev) =>
            prev.filter((bookmark) => bookmark.id !== optimisticBookmark.id)
          );
          toast.error("Failed to add bookmark");
          throw error;
        }
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      throw err;
    }
  };

  const refreshBookmarks = async () => {
    await fetchBookmarks();
  };

  return (
    <BookmarksContext.Provider
      value={{
        bookmarks,
        isLoading,
        error,
        isBookmarked,
        toggleBookmark,
        refreshBookmarks,
      }}
    >
      {children}
    </BookmarksContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarksContext);
  if (context === undefined) {
    throw new Error("useBookmarks must be used within a BookmarksProvider");
  }
  return context;
};
