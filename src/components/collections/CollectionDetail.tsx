"use client";

import React, { useState, useEffect } from "react";
import { Collection, Material } from "@/lib/types/response.type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCollection,
  removeMaterialFromCollection,
  removeNestedCollection,
  processCollectionContent,
} from "@/api/collection.api";
import { Button } from "@/components/ui/button";
import { Edit, FolderHeart, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import MaterialGrid from "@/components/materials/MaterialGrid";
import { CollectionGrid } from "@/components/collections/CollectionGrid";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface CollectionDetailProps {
  collection: Collection;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CollectionDetail: React.FC<CollectionDetailProps> = ({
  collection,
  onEdit,
  onDelete,
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [nestedCollections, setNestedCollections] = useState<Collection[]>([]);

  // Fetch the complete collection with materials and nested collections
  const { data: collectionData, isLoading } = useQuery({
    queryKey: ["collection-detail", collection.id],
    queryFn: async () => {
      const response = await getCollection(collection.id);
      return response.data;
    },
  });

  // Extract materials and nested collections when data is loaded
  useEffect(() => {
    if (collectionData) {
      const { materials, nestedCollections } =
        processCollectionContent(collectionData);
      setMaterials(materials);
      setNestedCollections(nestedCollections);
    }
  }, [collectionData]);

  // Mutation to remove material from collection
  const removeMaterialMutation = useMutation({
    mutationFn: (params: { collectionId: string; materialId: string }) =>
      removeMaterialFromCollection(params.collectionId, params.materialId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collection-detail", collection.id],
      });
      toast.success("Material removed from collection");
    },
    onError: () => {
      toast.error("Failed to remove material from collection");
    },
  });

  // Mutation to remove nested collection
  const removeNestedCollectionMutation = useMutation({
    mutationFn: (params: { parentId: string; childId: string }) =>
      removeNestedCollection(params.parentId, params.childId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collection-detail", collection.id],
      });
      toast.success("Collection removed successfully");
    },
    onError: () => {
      toast.error("Failed to remove nested collection");
    },
  });

  const handleRemoveMaterial = (materialId: string) => {
    removeMaterialMutation.mutate({
      collectionId: collection.id,
      materialId,
    });
  };

  const handleRemoveNestedCollection = (collectionId: string) => {
    removeNestedCollectionMutation.mutate({
      parentId: collection.id,
      childId: collectionId,
    });
  };

  const handleCollectionClick = (collection: Collection) => {
    router.push(`/collection/${collection.id}`);
  };

  const handleMaterialClick = (material: Material) => {
    router.push(`/material/${material.id}`);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex justify-center items-center bg-blue-100 rounded-full w-12 h-12">
            <FolderHeart className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-2xl">{collection.label}</h2>
            <p className="text-gray-500 text-sm">
              Created{" "}
              {formatDistanceToNow(new Date(collection.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
          {onEdit && onDelete && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={onEdit}
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-red-600 hover:text-red-700"
                onClick={onDelete}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {collection.description && (
          <p className="mb-6 text-gray-600">{collection.description}</p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="border-b-2 border-blue-600 rounded-full w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
          {/* Materials Section */}
          <div className="mb-8">
            <h3 className="mb-4 font-semibold text-xl">Materials</h3>
            {materials.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <p className="text-gray-600">
                  No materials in this collection yet
                </p>
              </div>
            ) : (
              <MaterialGrid
                materials={materials}
                onMaterialClick={handleMaterialClick}
                viewMode="grid"
              />
            )}
          </div>

          {/* Nested Collections Section */}
          <div className="mb-6">
            <h3 className="mb-4 font-semibold text-xl">Nested Collections</h3>
            {nestedCollections.length === 0 ? (
              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <p className="text-gray-600">No nested collections</p>
              </div>
            ) : (
              <CollectionGrid
                collections={nestedCollections}
                onCollectionClick={handleCollectionClick}
                onDelete={handleRemoveNestedCollection}
                viewMode="grid"
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CollectionDetail;
