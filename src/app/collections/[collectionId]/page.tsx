"use client";

import React, { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { AuthContext } from "@/contexts/authContext";
import { Collection } from "@/lib/types/response.type";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CollectionDetail from "@/components/collections/CollectionDetail";
import CollectionForm from "@/components/collections/forms/CollectionForm";
import { getCollection, deleteCollection } from "@/api/collection.api";
import toast from "react-hot-toast";

export default function CollectionPage() {
  const { collectionId } = useParams();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { user } = useContext(AuthContext) ?? { user: null };

  useEffect(() => {
    const fetchCollection = async () => {
      if (!collectionId || typeof collectionId !== "string") {
        setError("Invalid collection ID");
        setLoading(false);
        return;
      }

      try {
        const response = await getCollection(collectionId);
        if (response?.status === "success") {
          setCollection(response.data);
        } else {
          setError("Failed to load collection details");
        }
      } catch (err) {
        console.error("Error fetching collection:", err);
        setError("An error occurred while loading the collection");
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [collectionId]);

  const isOwner = user && collection?.creatorId === user.id;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSuccess = (updatedCollection: Collection) => {
    setCollection(updatedCollection);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!collection) return;

    try {
      const response = await deleteCollection(collection.id);
      if (response?.status === "success") {
        toast.success("Collection deleted successfully");
        router.push("/dashboard/collections");
      } else {
        toast.error("Failed to delete collection");
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
      toast.error("An error occurred while deleting the collection");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto w-12 h-12 text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading collection...</p>
        </div>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="mx-auto px-4 py-8 container">
        <div className="bg-red-50 p-4 rounded-lg text-red-600">
          <p>{error || "Collection not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 max-w-6xl container">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
      </div>

      {isEditing ? (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="mb-4 font-medium text-2xl">Edit Collection</h2>
          <CollectionForm
            initialData={collection}
            onSuccess={handleEditSuccess}
            onCancel={handleEditCancel}
          />
        </div>
      ) : (
        <CollectionDetail
          collection={collection}
          onEdit={isOwner ? handleEdit : undefined}
          onDelete={isOwner ? handleDelete : undefined}
        />
      )}
    </div>
  );
}
