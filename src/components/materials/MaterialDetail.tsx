"use client";

import React, { useState } from "react";
import Card from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge";
import {
  Material,
  VisibilityEnum,
  RestrictionEnum,
} from "@/lib/types/response.type";
import {
  Eye,
  Download,
  ThumbsUp,
  Tag,
  Book,
  Lock,
  Globe,
  FileIcon,
  Megaphone,
  Bookmark,
} from "lucide-react";
import { Button } from "../ui/button";
import { getMaterialDownloadUrl } from "@/api/material.api";
import AdvertCard from "./AdvertCard";
import { useBookmarks } from "@/contexts/bookmarksContext";
import { cn } from "@/lib/utils";

interface MaterialDetailProps {
  material: Material;
  isOwner?: boolean;
  onEdit?: (material: Material) => void;
  onDelete?: (materialId: string) => void;
  onClose?: () => void;
}

const MaterialDetail: React.FC<MaterialDetailProps> = ({
  material,
  isOwner = false,
  onEdit,
  onDelete,
  onClose,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const isCurrentlyBookmarked = isBookmarked(material.id);

  const handleBookmarkToggle = async () => {
    try {
      await toggleBookmark(material.id);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const downloadFile = async (url: string, filename: string) => {
    try {
      setIsDownloading(true);
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename || "downloaded-file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cache the blob URL for fallback
      setDownloadUrl(downloadUrl);

      // Cleanup after 5 minutes
      setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
        setDownloadUrl(null);
      }, 300000); // 5 minutes
    } catch (error) {
      console.error("Error downloading file:", error);
      throw error;
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await getMaterialDownloadUrl(material.id);
      if (response?.data.url) {
        const filename = material.resource?.resourceAddress
          ? material.resource.resourceAddress.split("/").pop() || material.label
          : material.label;

        await downloadFile(response.data.url, filename);
      }
    } catch (error) {
      console.error("Error downloading material:", error);
    }
  };

  const handleFallbackDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, "_blank");
    } else {
      window.open(material.resource?.resourceAddress, "_blank");
    }
  };

  const handleEdit = () => {
    if (onEdit) onEdit(material);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(material.id);
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileIcon className="w-6 h-6 text-red-500" />;
      case "video":
        return <FileIcon className="w-6 h-6 text-blue-500" />;
      case "image":
        return <FileIcon className="w-6 h-6 text-green-500" />;
      default:
        return <FileIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm mx-auto p-6 max-w-4xl">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          {getFileIcon(material.type)}
          <div>
            <h1 className="font-bold text-gray-900 text-2xl">
              {material.label}
            </h1>
            <p className="text-gray-600 text-sm">
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
            onClick={handleBookmarkToggle}
          >
            <Bookmark
              className={cn("w-4 h-4", isCurrentlyBookmarked && "fill-current")}
            />
          </Button>
          {isOwner && (
            <>
              <Button variant="outline" onClick={handleEdit}>
                Edit
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </>
          )}
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>

      {/* Display associated adverts if available */}
      {material.adverts && material.adverts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-lg">
              {material.adverts.length > 1 ? "Advertisements" : "Advertisement"}
            </h3>
          </div>
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            {material.adverts.map((advert) => (
              <AdvertCard key={advert.id} advert={advert} isPreview={true} />
            ))}
          </div>
        </div>
      )}

      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mb-6">
        <div>
          <h3 className="mb-2 font-semibold text-lg">Description</h3>
          <p className="text-gray-700">
            {material.description || "No description available"}
          </p>

          {material.targetCourse && (
            <div className="mt-4">
              <h3 className="mb-2 font-semibold text-lg">Course</h3>
              <div className="flex items-center gap-2 text-gray-700">
                <Book className="w-4 h-4" />
                <span>
                  {material.targetCourse.courseCode} -{" "}
                  {material.targetCourse.courseName}
                </span>
              </div>
            </div>
          )}

          <div className="mt-4">
            <h3 className="mb-2 font-semibold text-lg">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {material.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Eye className="w-4 h-4" />
              <span>{material.views} Views</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Download className="w-4 h-4" />
              <span>{material.downloads} Downloads</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <ThumbsUp className="w-4 h-4" />
              <span>{material.likes} Likes</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600 text-sm">
                {material.visibility === VisibilityEnum.PUBLIC
                  ? "Public"
                  : "Private"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600 text-sm">
                {material.restriction === RestrictionEnum.DOWNLOADABLE
                  ? "Downloadable"
                  : "Read Only"}
              </span>
            </div>
          </div>

          {material.restriction === RestrictionEnum.DOWNLOADABLE && (
            <div className="space-y-2">
              <Button
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 w-full"
                disabled={isDownloading}
              >
                <Download className="mr-2 w-4 h-4" />
                {isDownloading ? "Downloading..." : "Download Material"}
              </Button>

              {isDownloading && (
                <Button
                  variant="outline"
                  onClick={handleFallbackDownload}
                  className="w-full text-sm"
                >
                  If download hasn't started, click here
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MaterialDetail;
