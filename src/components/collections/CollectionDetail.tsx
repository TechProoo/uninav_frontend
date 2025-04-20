"use client";

import React from "react";
import { Collection } from "@/lib/types/response.type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMyCollections,
  removeMaterialFromCollection,
} from "@/api/collection.api";
import { Button } from "@/components/ui/button";
import { Edit, FolderHeart, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import MaterialGrid from "@/components/materials/MaterialGrid";
import toast from "react-hot-toast";

interface CollectionDetailProps {
  collection: Collection;
  onEdit: () => void;
  onDelete: () => void;
}

const CollectionDetail: React.FC<CollectionDetailProps> = ({
  collection,
  onEdit,
  onDelete,
}) => {
  const queryClient = useQueryClient();

  const { data: materials = [], isLoading } = useQuery({
    queryKey: ["collection-materials", collection.id],
    queryFn: () => getMyCollections(collection.id),
  });

  const removeMutation = useMutation({
    mutationFn: removeMaterialFromCollection,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["collection-materials", collection.id],
      });
      toast.success("Material removed from collection");
    },
    onError: () => {
      toast.error("Failed to remove material from collection");
    },
  });

  const handleRemoveMaterial = (materialId: string) => {
    removeMutation.mutate({
      collectionId: collection.id,
      materialId,
    });
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex justify-center items-center bg-blue-100 rounded-full w-12 h-12">
            <FolderHeart className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-2xl">{collection.name}</h2>
            <p className="text-gray-500 text-sm">
              Created{" "}
              {formatDistanceToNow(new Date(collection.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
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
        </div>

        {collection.description && (
          <p className="mb-6 text-gray-600">{collection.description}</p>
        )}
      </div>

      <div className="mb-6">
        <h3 className="mb-4 font-semibold text-xl">Materials</h3>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="border-b-2 border-blue-600 rounded-full w-8 h-8 animate-spin" />
          </div>
        ) : materials.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-gray-600">No materials in this collection yet</p>
          </div>
        ) : (
          <MaterialGrid
            materials={materials}
            onDelete={handleRemoveMaterial}
            viewMode="grid"
          />
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;
