"use client";

import React, { useState } from "react";
import {
  Material,
  RestrictionEnum,
  VisibilityEnum,
} from "@/lib/types/response.type";
import Card from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Download,
  ThumbsUp,
  FileIcon,
  BookOpen,
  Tag,
  MoreHorizontal,
  Megaphone,
  Bookmark,
  CalendarIcon,
  Globe,
  Lock,
  FolderPlus,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SelectCollection } from "@/components/collections/SelectCollection";
import {
  addMaterialToCollection,
  removeMaterialFromCollection,
} from "@/api/collection.api";
import { cn } from "@/lib/utils";
import { useBookmarks } from "@/contexts/bookmarksContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface MaterialCardProps {
  material: Material;
  onClick?: (material: Material) => void;
  hasAdvert?: boolean;
  viewMode?: "grid" | "list";
  className?: string;
  onEdit?: (material: Material) => void;
  onDelete?: (material: Material) => void;
  isOwner?: boolean;
  collectionId?: string; // Add this prop to know if we're in a collection context
  onRemoveFromCollection?: () => void; // Callback when material is removed from collection
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onClick,
  hasAdvert,
  viewMode = "grid",
  className,
  onEdit,
  onDelete,
  isOwner,
  collectionId,
  onRemoveFromCollection,
}) => {
  const router = useRouter();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const isCurrentlyBookmarked = isBookmarked(material.id);
  const [isCollectionDialogOpen, setIsCollectionDialogOpen] = useState(false);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleBookmark(material);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to toggle bookmark");
    }
  };

  const handleAddToCollection = async (collectionId: string) => {
    try {
      const response = await addMaterialToCollection(collectionId, material.id);
      if (response?.status === "success") {
        toast.success("Added to collection successfully");
        setIsCollectionDialogOpen(false);
      } else {
        toast.error("Failed to add to collection");
      }
    } catch (error) {
      console.error("Error adding to collection:", error);
      toast.error("An error occurred while adding to collection");
    }
  };

  const handleRemoveFromCollection = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (!collectionId) return;
      const response = await removeMaterialFromCollection(
        collectionId,
        material.id
      );
      if (response?.status === "success") {
        toast.success("Removed from collection successfully");
        onRemoveFromCollection?.();
      } else {
        toast.error("Failed to remove from collection");
      }
    } catch (error) {
      console.error("Error removing from collection:", error);
      toast.error("Failed to remove from collection");
    }
  };

  const getFileIcon = (type: string) => {
    const colorMap: Record<string, string> = {
      pdf: "text-red-500",
      video: "text-blue-500",
      image: "text-green-500",
    };
    return (
      <FileIcon
        className={cn(
          "w-5 h-5",
          colorMap[type.toLowerCase()] || "text-gray-500"
        )}
      />
    );
  };

  const InfoStat = ({ icon: Icon, value }: { icon: any; value: number }) => (
    <div className="flex items-center gap-1 text-gray-500 text-xs">
      <Icon className="w-4 h-4" />
      {value}
    </div>
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (viewMode === "list") {
    return (
      <>
        <Card
          className={cn(
            "group bg-white/80 hover:bg-white shadow-md hover:shadow-xl border border-gray-100 rounded-2xl p-3 sm:p-5 transition-all duration-200 cursor-pointer",
            className
          )}
          onClick={() => onClick?.(material)}
        >
          <div className="flex md:flex-row flex-col gap-3 md:gap-4">
            {/* Left side with icon and basic info */}
            <div className="flex flex-row md:flex-col items-start gap-3 md:gap-4 md:w-1/4">
              <div className="bg-gray-100 p-3 rounded-xl">
                {getFileIcon(material.type)}
              </div>
              <div className="flex flex-wrap items-start gap-2 md:mt-3">
                {material.targetCourse && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1 rounded-md text-xs"
                  >
                    <BookOpen className="w-3 h-3" />
                    {material.targetCourse.courseCode}
                  </Badge>
                )}
                {hasAdvert && (
                  <Badge className="flex items-center gap-1 bg-blue-100 mt-0 md:mt-2 rounded-md text-blue-700 text-xs">
                    <Megaphone className="w-3 h-3" />
                    Ad
                  </Badge>
                )}
              </div>
            </div>

            {/* Middle section with title and details */}
            <div className="md:w-2/4">
              <h3 className="font-semibold text-gray-900 text-base md:text-lg line-clamp-2">
                {material.label}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-gray-500 text-xs sm:text-sm">
                  by @{material.creator.username}
                </p>
                <span className="hidden sm:inline text-gray-400 text-xs">
                  •
                </span>
                <p className="flex items-center gap-1 text-gray-400 text-xs">
                  <CalendarIcon className="w-3 h-3" />
                  {formatDate(material.createdAt)}
                </p>
              </div>

              {material.targetCourse && (
                <p className="mt-2 text-gray-600 text-xs sm:text-sm truncate">
                  <span className="font-medium">Course:</span>{" "}
                  {material.targetCourse.courseName}
                </p>
              )}

              <p className="mt-2 text-gray-600 text-xs sm:text-sm line-clamp-2">
                {material.description}
              </p>

              <div className="flex flex-wrap items-center gap-2 mt-2">
                <div className="flex items-center gap-1 text-gray-600 text-xs">
                  <Globe className="w-3 h-3" />
                  {material.visibility === VisibilityEnum.PUBLIC
                    ? "Public"
                    : "Private"}
                </div>
                <div className="flex items-center gap-1 text-gray-600 text-xs">
                  <Lock className="w-3 h-3" />
                  {material.restriction === RestrictionEnum.DOWNLOADABLE
                    ? "Downloadable"
                    : "Read Only"}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3">
                {material.tags?.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="flex items-center gap-1 bg-white border-gray-300 rounded-md text-xs"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </Badge>
                ))}
                {material.tags?.length > 2 && (
                  <Badge variant="outline" className="rounded-md text-xs">
                    +{material.tags.length - 2}
                  </Badge>
                )}
              </div>
            </div>

            {/* Right side with stats and actions */}
            <div className="flex flex-row md:flex-col justify-between items-center md:items-end mt-3 md:mt-0 md:w-1/4">
              <div className="flex md:flex-col md:items-end gap-3 md:gap-4 md:mb-auto">
                <InfoStat icon={Eye} value={material.views} />
                <InfoStat icon={Download} value={material.downloads} />
                <InfoStat icon={ThumbsUp} value={material.likes} />
              </div>

              <div className="flex items-center gap-2 md:mt-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "transition-colors p-1 h-auto w-auto sm:p-2",
                    isCurrentlyBookmarked && "text-blue-600"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmarkClick(e);
                  }}
                >
                  <Bookmark
                    className={cn(
                      "w-4 h-4",
                      isCurrentlyBookmarked && "fill-current"
                    )}
                  />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="p-1 sm:p-2 w-auto h-auto transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCollectionDialogOpen(true);
                  }}
                >
                  <FolderPlus className="w-4 h-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="p-1 sm:p-2 w-auto h-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/material/${material.id}`);
                      }}
                    >
                      View Details
                    </DropdownMenuItem>
                    {collectionId ? (
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromCollection(e);
                        }}
                      >
                        Remove from Collection
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsCollectionDialogOpen(true);
                        }}
                      >
                        Add to Collection
                      </DropdownMenuItem>
                    )}
                    {isOwner && (
                      <>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit?.(material);
                          }}
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete?.(material);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </Card>

        <Dialog
          open={isCollectionDialogOpen}
          onOpenChange={setIsCollectionDialogOpen}
        >
          <DialogContent className="sm:max-w-md">
            <div className="space-y-4">
              <h2 className="font-medium text-lg">Add to Collection</h2>
              <SelectCollection
                onChange={(collectionId) => {
                  handleAddToCollection(collectionId);
                  setIsCollectionDialogOpen(false);
                }}
                value=""
                onCancel={() => setIsCollectionDialogOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Grid view with improved mobile responsiveness
  return (
    <>
      <Card
        className={cn(
          "group bg-white/80 hover:bg-white shadow-sm hover:shadow-md border border-gray-100 rounded-xl p-3 sm:p-4 transition-all duration-200 cursor-pointer",
          className
        )}
        onClick={() => onClick?.(material)}
      >
        {/* Reorganizing the card layout for better mobile display */}
        <div className="flex sm:flex-row flex-col gap-2">
          <div className="flex-grow min-w-0">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 bg-gray-100 p-1.5 sm:p-2 rounded-lg">
                {getFileIcon(material.type)}
              </div>
              <div className="flex-grow min-w-0">
                {/* Improved text handling for mobile */}
                <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">
                  {material.label}
                </h3>
                <p className="text-gray-500 text-xs sm:text-sm truncate">
                  by @{material.creator.username}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 mt-2">
              <Badge
                variant="secondary"
                className="px-1.5 sm:px-2 py-0 sm:py-0.5 text-xs"
              >
                {material.type}
              </Badge>

              <div className="flex items-center gap-1 ml-auto text-gray-400">
                {material.visibility === VisibilityEnum.PUBLIC ? (
                  <Globe className="w-3 sm:w-4 h-3 sm:h-4" />
                ) : (
                  <Lock className="w-3 sm:w-4 h-3 sm:h-4" />
                )}
              </div>

              {/* Show the advertisement indicator if needed */}
              {hasAdvert && (
                <Badge
                  variant="outline"
                  className="flex items-center bg-amber-50 px-1.5 py-0 border-amber-200 text-amber-700 text-xs"
                >
                  <Megaphone className="mr-0.5 w-2.5 sm:w-3 h-2.5 sm:h-3" />
                  <span className="hidden xs:inline">Ad</span>
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2">
              {material.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="px-1 sm:px-1.5 py-0 h-4 sm:h-5 text-[0.65rem] sm:text-xs"
                >
                  <Tag className="mr-0.5 w-2 sm:w-3 h-2 sm:h-3" />
                  {tag}
                </Badge>
              ))}
              {material.tags.length > 2 && (
                <Badge
                  variant="outline"
                  className="px-1 sm:px-1.5 py-0 h-4 sm:h-5 text-[0.65rem] sm:text-xs"
                >
                  +{material.tags.length - 2}
                </Badge>
              )}
            </div>
          </div>

          {/* Compact stats row */}
          <div className="flex sm:flex-col justify-between sm:justify-center sm:items-end mt-2 sm:mt-0 sm:ml-2">
            <div className="flex gap-2 sm:gap-1.5 text-gray-500 text-xs sm:text-sm">
              <div className="flex items-center">
                <Eye className="mr-1 w-3 sm:w-3.5 h-3 sm:h-3.5" />
                {material.views}
              </div>
              <div className="flex items-center">
                <Download className="mr-1 w-3 sm:w-3.5 h-3 sm:h-3.5" />
                {material.downloads}
              </div>
              <div className="flex items-center">
                <ThumbsUp className="mr-1 w-3 sm:w-3.5 h-3 sm:h-3.5" />
                {material.likes}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "p-1 h-6 w-6 sm:h-7 sm:w-7",
                  isCurrentlyBookmarked && "text-blue-600"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  handleBookmarkClick(e);
                }}
              >
                <Bookmark
                  className={cn(
                    "w-3 h-3 sm:w-3.5 sm:h-3.5",
                    isCurrentlyBookmarked && "fill-current"
                  )}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="p-1 w-6 sm:w-7 h-6 sm:h-7"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsCollectionDialogOpen(true);
                }}
              >
                <FolderPlus className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-1 w-6 sm:w-7 h-6 sm:h-7"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/material/${material.id}`);
                    }}
                  >
                    View Details
                  </DropdownMenuItem>
                  {collectionId ? (
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromCollection(e);
                      }}
                    >
                      Remove from Collection
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsCollectionDialogOpen(true);
                      }}
                    >
                      Add to Collection
                    </DropdownMenuItem>
                  )}
                  {isOwner && (
                    <>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit?.(material);
                        }}
                      >
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete?.(material);
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </Card>

      <Dialog
        open={isCollectionDialogOpen}
        onOpenChange={setIsCollectionDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <h2 className="font-medium text-lg">Add to Collection</h2>
            <SelectCollection
              onChange={(collectionId) => {
                handleAddToCollection(collectionId);
                setIsCollectionDialogOpen(false);
              }}
              value=""
              onCancel={() => setIsCollectionDialogOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MaterialCard;
