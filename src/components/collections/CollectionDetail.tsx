"use client";

import React, { useState, useEffect } from "react";
import { Collection, Material } from "@/lib/types/response.type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCollection,
  removeMaterialFromCollection,
  removeNestedCollection,
  processCollectionContent,
  deleteCollection,
} from "@/api/collection.api";
import { Button } from "@/components/ui/button";
import { Edit, FolderHeart, Trash2, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import MaterialGrid from "@/components/materials/MaterialGrid";
import { CollectionGrid } from "@/components/collections/CollectionGrid";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Mutation to delete the entire collection
  const deleteCollectionMutation = useMutation({
    mutationFn: (collectionId: string) => deleteCollection(collectionId),
    onSuccess: () => {
      toast.success("Collection deleted successfully");
      if (onDelete) {
        onDelete();
      } else {
        router.push("/collections");
      }
    },
    onError: () => {
      toast.error("Failed to delete collection");
      setIsDeleting(false);
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

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleting(true);
    deleteCollectionMutation.mutate(collection.id);
  };

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <div className="flex sm:flex-row flex-col sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex justify-center items-center bg-blue-100 rounded-full w-10 sm:w-12 h-10 sm:h-12">
            <FolderHeart className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-xl sm:text-2xl">
              {collection.label}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
              Created{" "}
              {formatDistanceToNow(new Date(collection.createdAt), {
                addSuffix: true,
              })}
            </p>
          </div>
          {onEdit && onDelete && (
            <div className="flex self-start sm:self-auto gap-2 mt-2 sm:mt-0">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 sm:gap-2 px-2 sm:px-3 text-sm"
                onClick={onEdit}
              >
                <Edit className="w-3 sm:w-4 h-3 sm:h-4" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 sm:gap-2 px-2 sm:px-3 text-red-600 hover:text-red-700 text-sm"
                onClick={handleDelete}
              >
                <Trash2 className="w-3 sm:w-4 h-3 sm:h-4" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {collection.description && (
          <p className="mb-4 sm:mb-6 text-gray-600 text-sm sm:text-base">
            {collection.description}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-6 sm:py-8">
          <div className="border-b-2 border-blue-600 rounded-full w-6 sm:w-8 h-6 sm:h-8 animate-spin" />
        </div>
      ) : (
        <>
          {/* Materials Section */}
          <div className="mb-6 sm:mb-8">
            <h3 className="mb-3 sm:mb-4 font-semibold text-lg sm:text-xl">
              Materials
            </h3>
            {materials.length === 0 ? (
              <div className="bg-gray-50 p-4 sm:p-8 rounded-lg text-center">
                <p className="text-gray-600 text-sm sm:text-base">
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
          <div className="mb-4 sm:mb-6">
            <h3 className="mb-3 sm:mb-4 font-semibold text-lg sm:text-xl">
              Nested Collections
            </h3>
            {nestedCollections.length === 0 ? (
              <div className="bg-gray-50 p-4 sm:p-8 rounded-lg text-center">
                <p className="text-gray-600 text-sm sm:text-base">
                  No nested collections
                </p>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="max-w-[90%] sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription className="text-sm">
              Are you sure you want to delete "{collection.label}"? This action
              cannot be undone and all materials will be removed from this
              collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="text-sm">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white text-sm"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 w-3 sm:w-4 h-3 sm:h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CollectionDetail;
