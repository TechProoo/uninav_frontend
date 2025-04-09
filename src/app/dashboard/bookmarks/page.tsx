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
    <div className="mx-auto container">
      <div className="flex justify-between items-center mb-6">
        {selectedBookmark ? (
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => {
              setSelectedBookmark(null);
              setSelectedMaterial(null);
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bookmarks
          </Button>
        ) : (
          <>
            <h1 className="font-bold text-3xl">Manage Bookmarks</h1>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="w-10 h-10"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="w-10 h-10"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {!selectedBookmark && (
        <>
          <div className="mb-6">
            <div className="relative">
              <Search className="top-1/2 left-3 absolute w-5 h-5 text-gray-400 -translate-y-1/2 transform" />
              <input
                type="search"
                placeholder="Search your bookmarks..."
                className="py-2 pr-4 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredBookmarks.length === 0 ? (
            <div className="bg-white shadow-md p-8 rounded-lg text-center">
              <BookmarkIcon className="mx-auto w-12 h-12 text-gray-400" />
              <h3 className="mt-2 font-medium text-gray-900 text-sm">
                No bookmarks found
              </h3>
              <p className="mt-1 text-gray-500 text-sm">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Start by bookmarking materials you want to access quickly"}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Bookmark</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this bookmark? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteBookmark}
              disabled={deleteMutation.isPending}
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
