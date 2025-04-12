"use client";

import React from "react";
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
      <Card
        className={cn(
          "group bg-white/80 hover:bg-white shadow-md hover:shadow-xl border border-gray-100 rounded-2xl p-5 transition-all duration-200 cursor-pointer",
          className
        )}
        onClick={() => onClick?.(material)}
      >
        <div className="flex md:flex-row flex-col gap-4">
          {/* Left side with icon and basic info */}
          <div className="flex flex-row md:flex-col items-start gap-4 md:w-1/4">
            <div className="bg-gray-100 p-3 rounded-xl">
              {getFileIcon(material.type)}
            </div>
            <div className="flex flex-col items-start md:mt-3">
              {material.targetCourse && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 rounded-md"
                >
                  <BookOpen className="w-3 h-3" />
                  {material.targetCourse.courseCode}
                </Badge>
              )}
              {hasAdvert && (
                <Badge className="flex items-center gap-1 bg-blue-100 mt-2 rounded-md text-blue-700">
                  <Megaphone className="w-3 h-3" />
                  Ad
                </Badge>
              )}
            </div>
          </div>

          {/* Middle section with title and details */}
          <div className="md:w-2/4">
            <h3 className="font-semibold text-gray-900 text-lg">
              {material.label}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-gray-500 text-sm">
                by @{material.creator.username}
              </p>
              <span className="text-gray-400 text-xs">•</span>
              <p className="flex items-center gap-1 text-gray-400 text-xs">
                <CalendarIcon className="w-3 h-3" />
                {formatDate(material.createdAt)}
              </p>
            </div>

            {material.targetCourse && (
              <p className="mt-2 text-gray-600 text-sm">
                <span className="font-medium">Course:</span>{" "}
                {material.targetCourse.courseName}
              </p>
            )}

            <p className="mt-2 text-gray-600 text-sm line-clamp-2">
              {material.description}
            </p>

            <div className="flex items-center gap-2 mt-2">
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
              {material.tags?.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="flex items-center gap-1 bg-white border-gray-300 rounded-md"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Right side with stats and actions */}
          <div className="flex flex-row md:flex-col justify-between md:items-end md:w-1/4">
            <div className="flex md:flex-col md:items-end gap-4 md:mb-auto">
              <InfoStat icon={Eye} value={material.views} />
              <InfoStat icon={Download} value={material.downloads} />
              <InfoStat icon={ThumbsUp} value={material.likes} />
            </div>

            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-colors",
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
                  <Button variant="ghost" size="icon" className="p-0 w-8 h-8">
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
        </div>
      </Card>
    );
  }

  // Grid view remains mostly the same
  return (
    <Card
      className={cn(
        "group bg-white/80 hover:bg-white shadow-md hover:shadow-xl border border-gray-100 rounded-2xl p-5 transition-all duration-200 cursor-pointer",
        className
      )}
      onClick={() => onClick?.(material)}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-2 rounded-xl">
            {getFileIcon(material.type)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-base line-clamp-1">
              {material.label}
            </h3>
            <p className="text-gray-500 text-xs">
              by @{material.creator.username}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "transition-colors",
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
              <Button variant="ghost" size="icon" className="p-0 w-8 h-8">
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

      <div className="flex flex-wrap gap-2 mt-3">
        {material.targetCourse && (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 rounded-md"
          >
            <BookOpen className="w-3 h-3" />
            {material.targetCourse.courseCode}
          </Badge>
        )}

        {hasAdvert && (
          <Badge className="flex items-center gap-1 bg-blue-100 rounded-md text-blue-700">
            <Megaphone className="w-3 h-3" />
            Ad
          </Badge>
        )}
      </div>

      <p className="mt-2 text-gray-600 text-sm line-clamp-2">
        {material.description}
      </p>

      <div className="flex flex-wrap gap-2 mt-3">
        {material.tags?.slice(0, 3).map((tag) => (
          <Badge
            key={tag}
            variant="outline"
            className="flex items-center gap-1 bg-white border-gray-300 rounded-md"
          >
            <Tag className="w-3 h-3" />
            {tag}
          </Badge>
        ))}
        {material.tags?.length > 3 && (
          <Badge variant="outline" className="rounded-md">
            +{material.tags.length - 3}
          </Badge>
        )}
      </div>

      <div className="flex justify-between items-center mt-4 text-gray-500 text-xs">
        <div className="flex items-center gap-4">
          <InfoStat icon={Eye} value={material.views} />
          <InfoStat icon={Download} value={material.downloads} />
          <InfoStat icon={ThumbsUp} value={material.likes} />
        </div>
      </div>
    </Card>
  );
};

export default MaterialCard;
