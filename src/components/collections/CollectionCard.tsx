"use client";

import React, { useState } from "react";
import { Collection, VisibilityEnum } from "@/lib/types/response.type";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/authContext";
import { deleteCollection } from "@/api/collection.api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AddToCollectionDialog } from "./AddToCollectionDialog";

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
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const contentCount = collection.content?.length || 0;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCollection(collection.id);
      onDelete?.(collection.id);
      toast.success("Collection deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete collection");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleClick = () => {
    if (onCollectionClick) {
      onCollectionClick(collection);
    } else {
      router.push(`/collections/${collection.id}`);
    }
  };

  if (viewMode === "list") {
    return (
      <>
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
                      onClick={handleDeleteClick}
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

        <AddToCollectionDialog
          isOpen={isCollectionDialogOpen}
          onOpenChange={setIsCollectionDialogOpen}
          itemId={collection.id}
          itemType="collection"
          excludeIds={[collection.id]}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Collection</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{collection.label}"? This
                action cannot be undone and all materials will be removed from
                this collection.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
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
                  setIsCollectionDialogOpen(true);
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
                onClick={handleDeleteClick}
                className="bg-red-500 hover:bg-red-600 p-1 rounded-full text-white"
                size="icon"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        )}
      </div>

      <AddToCollectionDialog
        isOpen={isCollectionDialogOpen}
        onOpenChange={setIsCollectionDialogOpen}
        itemId={collection.id}
        itemType="collection"
        excludeIds={[collection.id]}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{collection.label}"? This action
              cannot be undone and all materials will be removed from this
              collection.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CollectionCard;
