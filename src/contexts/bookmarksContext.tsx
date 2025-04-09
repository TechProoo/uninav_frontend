"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Bookmark } from "@/lib/types/response.type";
import {
  getAllBookmarks,
  createBookmark,
  deleteBookmark,
} from "@/api/user.api";
import { useAuth } from "./authContext";

interface BookmarksContextType {
  bookmarks: Bookmark[];
  isLoading: boolean;
  error: string | null;
  isBookmarked: (materialId: string) => boolean;
  toggleBookmark: (materialId: string, note?: string) => Promise<void>;
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

  const toggleBookmark = async (materialId: string, note?: string) => {
    try {
      const existingBookmark = bookmarks.find(
        (bookmark) => bookmark.materialId === materialId
      );

      if (existingBookmark) {
        await deleteBookmark(existingBookmark.id);
        setBookmarks((prev) =>
          prev.filter((bookmark) => bookmark.id !== existingBookmark.id)
        );
      } else {
        const newBookmark = await createBookmark({ materialId, note });
        if (newBookmark) {
          setBookmarks((prev) => [...prev, newBookmark]);
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
