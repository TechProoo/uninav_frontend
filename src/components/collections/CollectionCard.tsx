"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Collection, VisibilityEnum } from "@/lib/types/response.type";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookMarked,
  Edit,
  FolderOpen,
  MoreHorizontal,
  Share2,
  Trash2,
  FolderPlus,
  Globe,
  Lock,
  Tag,
  PlusCircle,
  User,
} from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import {
  deleteCollection,
  addNestedCollection,
  processCollectionContent,
} from "@/api/collection.api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SelectCollection } from "./SelectCollection";

interface CollectionCardProps {
  collection: Collection;
  viewMode?: "grid" | "list";
  onCollectionClick?: (collection: Collection) => void;
  onDelete?: (id: string) => void;
  onEdit?: (collection: Collection) => void;
  isParent?: boolean; // Indicates if this is a parent collection card
}

const CollectionCard = ({
  collection,
  viewMode = "grid",
  onCollectionClick,
  onDelete,
  onEdit,
  isParent = false,
}: CollectionCardProps) => {
  const { user } = useAuth();
  const router = useRouter();
  const isOwner = user?.id === collection.creatorId;
  const [isNestDialogOpen, setIsNestDialogOpen] = useState(false);

  const contentCount = collection.content?.length || 0;

  const handleDelete = async () => {
    try {
      await deleteCollection(collection.id);
      onDelete?.(collection.id);
      toast.success("Collection deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete collection");
    }
  };

  const handleClick = () => {
    if (onCollectionClick) {
      onCollectionClick(collection);
    } else {
      router.push(`/collections/${collection.id}`);
    }
  };

  const handleAddNestedCollection = async (parentCollectionId: string) => {
    try {
      if (parentCollectionId === collection.id) {
        toast.error("Cannot nest a collection inside itself");
        return;
      }

      const response = await addNestedCollection(
        parentCollectionId,
        collection.id
      );
      if (response?.status === "success") {
        toast.success("Added to collection successfully");
        setIsNestDialogOpen(false);
      } else {
        toast.error("Failed to add to collection");
      }
    } catch (error) {
      console.error("Error adding to collection:", error);
      toast.error("An error occurred while adding to collection");
    }
  };

  if (viewMode === "list") {
    return (
      <div
        className="bg-white/80 hover:bg-white shadow-sm hover:shadow-md p-4 border border-gray-100 rounded-xl transition-all duration-200 cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex gap-4">
          <div className="bg-blue-50 p-3 rounded-xl">
            <FolderOpen className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex-grow">
            <h3 className="mb-2 font-semibold text-gray-900">
              {collection.label}
            </h3>
            <p className="mb-3 text-gray-600 text-sm line-clamp-2">
              {collection.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {contentCount} items
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-1 text-xs"
              >
                {collection.visibility === VisibilityEnum.PUBLIC ? (
                  <Globe className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                {collection.visibility.toLowerCase()}
              </Badge>
            </div>
          </div>
          {isOwner && (
            <div className="flex items-start">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="w-8 h-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit?.(collection);
                    }}
                  >
                    <Edit className="mr-2 w-4 h-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                  >
                    <Trash2 className="mr-2 w-4 h-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="group bg-white/80 hover:bg-white shadow-sm hover:shadow-md p-4 border border-gray-100 rounded-xl transition-all duration-200 cursor-pointer"
        onClick={handleClick}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-blue-50 p-2 rounded-lg">
            <FolderOpen className="w-5 h-5 text-blue-500" />
          </div>
          <Badge variant="secondary" className="text-xs">
            {contentCount} {contentCount === 1 ? "item" : "items"}
          </Badge>

          {!isParent && (
            <div className="opacity-0 group-hover:opacity-100 ml-auto transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="p-1 w-7 h-7"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsNestDialogOpen(true);
                }}
                title="Add to another collection"
              >
                <FolderPlus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        <h3 className="mb-2 font-semibold text-gray-900 line-clamp-2">
          {collection.label}
        </h3>

        <p className="mb-3 text-gray-600 text-sm line-clamp-2">
          {collection.description}
        </p>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="flex items-center gap-1 text-xs"
            >
              {collection.visibility === VisibilityEnum.PUBLIC ? (
                <Globe className="w-3 h-3" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
              {collection.visibility.toLowerCase()}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <User className="w-3 h-3" />
            <span>@{collection.creator?.username || "user"}</span>
          </div>
        </div>

        {isOwner && !isParent && (
          <div className="-top-2 -right-2 absolute flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {onEdit && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(collection);
                }}
                className="bg-blue-500 hover:bg-blue-600 p-1 rounded-full text-white"
                size="icon"
              >
                <Edit className="w-3 h-3" />
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
                className="bg-red-500 hover:bg-red-600 p-1 rounded-full text-white"
                size="icon"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Add to Collection Dialog */}
      <Dialog open={isNestDialogOpen} onOpenChange={setIsNestDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <h2 className="font-medium text-lg">Add to Collection</h2>
            <p className="text-gray-500 text-sm">
              Select a collection to add "{collection.label}" as a nested
              collection:
            </p>
            <SelectCollection
              onChange={(collectionId) => {
                handleAddNestedCollection(collectionId);
              }}
              value=""
              onCancel={() => setIsNestDialogOpen(false)}
              excludeIds={[collection.id]} // Exclude the current collection
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CollectionCard;
