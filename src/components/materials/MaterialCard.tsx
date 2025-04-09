"use client";

import React from "react";
import { Material } from "@/lib/types/response.type";
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
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useBookmarks } from "@/contexts/bookmarksContext";

interface MaterialCardProps {
  material: Material;
  onClick?: (material: Material) => void;
  hasAdvert?: boolean;
  viewMode?: "grid" | "list";
  className?: string;
}

const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onClick,
  hasAdvert,
  viewMode = "grid",
  className,
}) => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const isCurrentlyBookmarked = isBookmarked(material.id);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleBookmark(material);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileIcon className="w-5 h-5 text-red-500" />;
      case "video":
        return <FileIcon className="w-5 h-5 text-blue-500" />;
      case "image":
        return <FileIcon className="w-5 h-5 text-green-500" />;
      default:
        return <FileIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  if (viewMode === "list") {
    return (
      <Card
        className={cn(
          "bg-white/80 hover:shadow-lg backdrop-blur-sm p-4 transition-shadow cursor-pointer",
          className
        )}
        onClick={() => onClick?.(material)}
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-1 gap-4">
            <div className="bg-gray-100 p-2 rounded-lg">
              {getFileIcon(material.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900">
                  {material.label}
                </h3>
                {material.targetCourse && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <BookOpen className="w-3 h-3" />
                    {material.targetCourse.courseCode}
                  </Badge>
                )}
                {hasAdvert && (
                  <Badge className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700">
                    <Megaphone className="w-3 h-3" />
                    Ad
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-gray-600 text-sm line-clamp-2">
                {material.description}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center text-gray-500 text-sm">
                  <Eye className="mr-1 w-4 h-4" />
                  {material.views}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Download className="mr-1 w-4 h-4" />
                  {material.downloads}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <ThumbsUp className="mr-1 w-4 h-4" />
                  {material.likes}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hover:text-blue-600",
                isCurrentlyBookmarked && "text-blue-600"
              )}
              onClick={handleBookmarkClick}
            >
              <Bookmark
                className={cn(
                  "w-4 h-4",
                  isCurrentlyBookmarked && "fill-current"
                )}
              />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 w-8 h-8">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>View Details</DropdownMenuItem>
                <DropdownMenuItem>Download</DropdownMenuItem>
                <DropdownMenuItem>Add to Collection</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "bg-white/80 hover:shadow-lg backdrop-blur-sm p-4 transition-shadow cursor-pointer",
        className
      )}
      onClick={() => onClick?.(material)}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-2 rounded-lg">
            {getFileIcon(material.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-1">
              {material.label}
            </h3>
            <p className="text-gray-500 text-sm">
              by {material.creator.firstName} {material.creator.lastName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "hover:text-blue-600",
              isCurrentlyBookmarked && "text-blue-600"
            )}
            onClick={handleBookmarkClick}
          >
            <Bookmark
              className={cn("w-4 h-4", isCurrentlyBookmarked && "fill-current")}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0 w-8 h-8">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Download</DropdownMenuItem>
              <DropdownMenuItem>Add to Collection</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {material.targetCourse && (
          <Badge variant="secondary" className="flex items-center gap-1 w-fit">
            <BookOpen className="w-3 h-3" />
            {material.targetCourse.courseCode}
          </Badge>
        )}

        {hasAdvert && (
          <Badge className="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700">
            <Megaphone className="w-3 h-3" />
            Ad
          </Badge>
        )}
      </div>

      <p className="mb-3 text-gray-600 text-sm line-clamp-2">
        {material.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {material.tags && material.tags.length > 0 ? (
          <>
            {material.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </Badge>
            ))}
            {material.tags.length > 3 && (
              <Badge variant="outline">+{material.tags.length - 3}</Badge>
            )}
          </>
        ) : null}
      </div>

      <div className="flex justify-between items-center text-gray-500 text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <Eye className="mr-1 w-4 h-4" />
            {material.views}
          </div>
          <div className="flex items-center">
            <Download className="mr-1 w-4 h-4" />
            {material.downloads}
          </div>
          <div className="flex items-center">
            <ThumbsUp className="mr-1 w-4 h-4" />
            {material.likes}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MaterialCard;
