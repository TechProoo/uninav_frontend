"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bookmark as BookmarkIcon,
  Search,
  ArrowLeft,
  Trash2,
  Grid,
  List,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllBookmarks, deleteBookmark } from "@/api/user.api";
import { getMaterialById } from "@/api/material.api";
import { Bookmark, Material } from "@/lib/types/response.type";
import { Button } from "@/components/ui/button";
import MaterialDetail from "@/components/materials/MaterialDetail";
import MaterialGrid from "@/components/materials/MaterialGrid";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ViewMode = "grid" | "list";

const BookmarksPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedBookmark, setSelectedBookmark] = useState<Bookmark | null>(
    null
  );
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bookmarkToDelete, setBookmarkToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const {
    data: bookmarks = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => getAllBookmarks(),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBookmark,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      if (selectedBookmark?.id === bookmarkToDelete) {
        setSelectedBookmark(null);
        setSelectedMaterial(null);
      }
      setIsDeleteDialogOpen(false);
      setBookmarkToDelete(null);
    },
  });

  const confirmDelete = (bookmarkId: string) => {
    setBookmarkToDelete(bookmarkId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteBookmark = async () => {
    if (bookmarkToDelete) {
      deleteMutation.mutate(bookmarkToDelete);
    }
  };

  const handleBookmarkClick = async (bookmark: Bookmark) => {
    if (!bookmark.material?.id) return;

    setSelectedBookmark(bookmark);
    try {
      const response = await getMaterialById(bookmark.material.id);
      if (response?.status === "success") {
        setSelectedMaterial(response.data);
      }
    } catch (error) {
      console.error("Error fetching material details:", error);
    }
  };

  const filteredBookmarks = (bookmarks || []).filter((bookmark) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      bookmark.material?.label.toLowerCase().includes(searchTerm) ||
      bookmark.material?.description?.toLowerCase().includes(searchTerm)
    );
  });

  const handleMaterialClick = (material: Material) => {
    const bookmark = (bookmarks || []).find(
      (b) => b.material?.id === material.id
    );
    if (bookmark) {
      handleBookmarkClick(bookmark);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="border-b-2 border-blue-700 rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600">
        An error occurred while loading your bookmarks
      </div>
    );
  }

  return (
    <div className="mx-auto px-2 sm:px-4 container">
      <div className="flex justify-between items-center mb-3 sm:mb-6">
        {selectedBookmark ? (
          <Button
            variant="ghost"
            className="gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-2 h-auto"
            onClick={() => {
              setSelectedBookmark(null);
              setSelectedMaterial(null);
            }}
          >
            <ArrowLeft className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            <span className="text-sm sm:text-base">Back to Bookmarks</span>
          </Button>
        ) : (
          <>
            <h1 className="section-heading">Manage Bookmarks</h1>
            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="w-8 sm:w-10 h-8 sm:h-10"
              >
                <Grid className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="w-8 sm:w-10 h-8 sm:h-10"
              >
                <List className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {!selectedBookmark && (
        <>
          <div className="mb-4 sm:mb-6">
            <div className="relative">
              <Search className="top-1/2 left-3 absolute w-4 sm:w-5 h-4 sm:h-5 text-gray-400 -translate-y-1/2 transform" />
              <input
                type="search"
                placeholder="Search your bookmarks..."
                className="py-1.5 sm:py-2 pr-4 pl-9 sm:pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full text-sm sm:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredBookmarks.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-8 sm:py-12 text-center">
              <BookmarkIcon className="mb-3 w-12 h-12 text-gray-300" />
              <h2 className="mb-1 font-medium text-gray-700 text-lg sm:text-xl">
                No bookmarks found
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                {searchQuery
                  ? "Try a different search term"
                  : "You haven't bookmarked any materials yet"}
              </p>
            </div>
          ) : (
            <MaterialGrid
              materials={filteredBookmarks.map(
                (bookmark) => bookmark.material!
              )}
              onMaterialClick={handleMaterialClick}
              viewMode={viewMode}
            />
          )}
        </>
      )}

      {selectedMaterial && (
        <MaterialDetail material={selectedMaterial} isOwner={false} />
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Bookmark</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this bookmark? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:flex-row flex-col sm:justify-end gap-2 sm:gap-0">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:w-auto"
              disabled={deleteMutation.isPending}
              onClick={handleDeleteBookmark}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookmarksPage;
