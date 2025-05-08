"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/authContext";
import { Collection } from "@/lib/types/response.type";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import CollectionDetail from "@/components/collections/CollectionDetail";
import { CollectionForm } from "@/components/collections/CollectionForm";
import { getCollection, deleteCollection } from "@/api/collection.api";
import toast from "react-hot-toast";
import Link from "next/link";
import BackButton from "@/components/ui/BackButton";

export default function CollectionPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const collectionId = params.collectionId as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchCollection = async () => {
      try {
        const response = await getCollection(collectionId);
        if (response.status === "success") {
          setCollection(response.data);
        } else {
          setError("Failed to load collection");
        }
      } catch (err: any) {
        console.error("Error fetching collection:", err);
        setError(
          err.message || "An error occurred while loading the collection"
        );
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

  const handleEditSuccess = () => {
    setIsEditing(false);
    // Refresh the collection data
    setLoading(true);
    fetchCollection();
  };

  const handleDelete = async () => {
    router.push("/dashboard/collections");
  };

  const fetchCollection = async () => {
    try {
      const response = await getCollection(collectionId);
      if (response.status === "success") {
        setCollection(response.data);
      } else {
        setError("Failed to load collection");
      }
    } catch (err: any) {
      console.error("Error fetching collection:", err);
      setError(err.message || "An error occurred while loading the collection");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
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
      <div className="flex flex-col justify-center items-center p-4 min-h-[70vh]">
        <div className="bg-red-50 p-6 border border-red-200 rounded-lg max-w-md text-center">
          <h2 className="mb-2 font-bold text-red-600 text-xl">Error</h2>
          <p className="mb-6 text-gray-700">
            {error ||
              "Collection not found. It may have been removed or you don't have permission to view it."}
          </p>
          <Button asChild>
            <Link href="/collections">Return to Collections</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 max-w-6xl container">
      <div className="mb-8">
        <BackButton />
      </div>

      {isEditing ? (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="mb-4 font-medium text-2xl">Edit Collection</h2>
          <CollectionForm
            collection={collection}
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
