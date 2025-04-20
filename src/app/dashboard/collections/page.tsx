"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle, Search, FolderHeart, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collection } from "@/lib/types/response.type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyCollections, deleteCollection } from "@/api/collection.api";
import { CollectionGrid } from "@/components/collections/CollectionGrid";
import CollectionDetail from "@/components/collections/CollectionDetail";
import CollectionForm from "@/components/collections/forms/CollectionForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import toast from "react-hot-toast";

type ViewMode = "grid" | "list";

const CollectionsPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  // Fetch collections
  const {
    data: collections = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      let response = await getMyCollections();
      return response.data;
    },
  });
  // Delete collection mutation
  const deleteMutation = useMutation({
    mutationFn: deleteCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      toast.success("Collection deleted successfully");
      setSelectedCollection(null);
    },
    onError: () => {
      toast.error("Failed to delete collection");
    },
  });
  // Filter collections based on search
  const filteredCollections = collections.filter((collection) =>
    collection.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCollectionClick = (collection: Collection) => {
    setSelectedCollection(collection);
  };

  const handleDeleteCollection = (collection: Collection) => {
    if (window.confirm("Are you sure you want to delete this collection?")) {
      deleteMutation.mutate(collection.id);
    }
  };

  const handleEditCollection = (collection: Collection) => {
    setSelectedCollection(collection);
    setShowEditForm(true);
  };

  const handleBackNavigation = () => {
    if (showEditForm) {
      setShowEditForm(false);
      setSelectedCollection((prev) => prev);
    } else if (selectedCollection) {
      setSelectedCollection(null);
    } else if (showAddForm) {
      setShowAddForm(false);
    }
  };

  return (
    <div className="mx-auto px-4 container">
      <div className="flex flex-wrap justify-between items-center gap-2 mb-6">
        {showAddForm || showEditForm || selectedCollection ? (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={handleBackNavigation}
          >
            Back
          </Button>
        ) : null}
        <h1 className="font-bold text-2xl">My Collections</h1>
        <Button onClick={() => setShowAddForm(true)} className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Create Collection
        </Button>
      </div>

      {!selectedCollection && !showAddForm && !showEditForm && (
        <>
          <div className="flex sm:flex-row flex-col gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="top-1/2 left-3 absolute w-4 h-4 text-gray-400 -translate-y-1/2" />
              <input
                type="search"
                placeholder="Search collections..."
                className="py-2 pr-4 pl-10 border border-gray-300 rounded-lg w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="border-b-2 border-blue-600 rounded-full w-8 h-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="bg-red-50 p-4 rounded text-red-600">
              An error occurred while loading collections
            </div>
          ) : filteredCollections.length === 0 ? (
            <div className="flex flex-col justify-center items-center py-12 text-center">
              <FolderHeart className="mb-4 w-12 h-12 text-gray-400" />
              <h2 className="mb-2 font-medium text-gray-900 text-lg">
                No collections found
              </h2>
              <p className="text-gray-500">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first collection to organize your materials"}
              </p>
            </div>
          ) : (
            <CollectionGrid
              collections={filteredCollections}
              onCollectionClick={handleCollectionClick}
              onEdit={handleEditCollection}
              onDelete={handleDeleteCollection}
              viewMode={viewMode}
            />
          )}
        </>
      )}

      {showAddForm && (
        <CollectionForm
          onSuccess={() => {
            setShowAddForm(false);
            queryClient.invalidateQueries({ queryKey: ["collections"] });
          }}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {showEditForm && selectedCollection && (
        <CollectionForm
          initialData={selectedCollection}
          onSuccess={() => {
            setShowEditForm(false);
            queryClient.invalidateQueries({ queryKey: ["collections"] });
          }}
          onCancel={() => setShowEditForm(false)}
        />
      )}

      {selectedCollection && !showEditForm && (
        <CollectionDetail
          collection={selectedCollection}
          onEdit={() => setShowEditForm(true)}
          onDelete={() => handleDeleteCollection(selectedCollection)}
        />
      )}
    </div>
  );
};

export default CollectionsPage;
