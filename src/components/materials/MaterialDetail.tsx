"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge";
import {
  Material,
  VisibilityEnum,
  RestrictionEnum,
  Advert,
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
import {
  getMaterialDownloadUrl,
  incrementDownloadCount,
  likeOrUnlikeMaterial,
  getMaterialById,
} from "@/api/material.api";
import AdvertCard from "./AdvertCard";
import AdvertDetail from "./AdvertDetail";
import { useBookmarks } from "@/contexts/bookmarksContext";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface MaterialDetailProps {
  material: Material;
  isOwner?: boolean;
  onEdit?: (material: Material) => void;
  onDelete?: (materialId: string) => void;
  onClose?: () => void;
}

const MaterialDetail: React.FC<MaterialDetailProps> = ({
  material: initialMaterial,
  isOwner = false,
  onEdit,
  onDelete,
  onClose,
}) => {
  const [material, setMaterial] = useState(initialMaterial);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const isCurrentlyBookmarked = isBookmarked(material.id);
  const [selectedAdvert, setSelectedAdvert] = useState<Advert | null>(null);

  useEffect(() => {
    const fetchCompleteData = async () => {
      try {
        const response = await getMaterialById(initialMaterial.id);
        if (response?.status === "success") {
          setMaterial(response.data);
        }
      } catch (error) {
        console.error("Error fetching complete material data:", error);
        toast.error("Failed to load material details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompleteData();
  }, [initialMaterial.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="border-b-2 border-blue-700 rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

  const handleBookmarkToggle = async () => {
    try {
      await toggleBookmark(material);
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleLikeToggle = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      // Optimistic update
      setMaterial((prev) => ({
        ...prev,
        likes: prev.likes + (prev.isLiked ? -1 : 1),
        isLiked: !prev.isLiked,
      }));

      const response = await likeOrUnlikeMaterial(material.id);
      if (response?.status === "success") {
        // Update with actual server state
        setMaterial((prev) => ({
          ...prev,
          likes: response.data.likesCount,
          isLiked: response.data.liked,
        }));
      }
    } catch (error) {
      // Revert optimistic update on error
      setMaterial((prev) => ({
        ...prev,
        likes: prev.likes + (prev.isLiked ? 1 : -1),
        isLiked: !prev.isLiked,
      }));
      console.error("Error toggling like:", error);
    } finally {
      setIsLiking(false);
    }
  };

  const getFileExtension = (url: string): string => {
    // Try to get extension from URL
    const urlMatch = url.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/);
    if (urlMatch) return urlMatch[1];

    // If no extension found, infer from material type
    switch (material.type.toLowerCase()) {
      case "pdf":
        return "pdf";
      case "video":
        return "mp4";
      case "image":
        return "png";
      default:
        return "";
    }
  };

  const downloadFile = async (url: string) => {
    try {
      setIsDownloading(true);

      // First try to fetch the file
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to download file: ${response.statusText}`);
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("Downloaded file is empty");
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      setDownloadUrl(downloadUrl);

      // Get the file extension and create filename
      const extension = getFileExtension(url);
      const filename = `${material.label}${extension ? `.${extension}` : ""}`;

      // Create and trigger download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      try {
        // Only increment download count if download was successful
        await incrementDownloadCount(material.id);

        // Update local state optimistically
        setMaterial((prev) => ({
          ...prev,
          downloads: prev.downloads + 1,
        }));

        toast.success("Download started successfully");
      } catch (error) {
        console.error("Failed to increment download count:", error);
        // Don't show error to user since download still worked
      }

      // Cleanup after 5 minutes
      setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl);
        setDownloadUrl(null);
      }, 300000); // 5 minutes
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file. Please try again.");
      throw error;
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (!material.resource) {
        toast.error("No resource available for download");
        return;
      }

      // Handle different resource types
      if (
        material.resource.resourceType === "url" ||
        material.resource.resourceType === "GDrive"
      ) {
        window.open(material.resource.resourceAddress, "_blank");
        return;
      }

      const response = await getMaterialDownloadUrl(material.id);
      if (!response?.data?.url) {
        throw new Error("Failed to get download URL");
      }

      await downloadFile(response.data.url);
    } catch (error) {
      console.error("Error downloading material:", error);
      toast.error("Failed to download material. Please try again.");
      setIsDownloading(false);
    }
  };

  const handleFallbackDownload = () => {
    if (!material.resource) {
      toast.error("No resource available for download");
      return;
    }

    try {
      if (
        material.resource.resourceType === "url" ||
        material.resource.resourceType === "GDrive"
      ) {
        window.open(material.resource.resourceAddress, "_blank");
      } else if (downloadUrl) {
        window.open(downloadUrl, "_blank");
      } else {
        window.open(material.resource.resourceAddress, "_blank");
      }
    } catch (error) {
      console.error("Error with fallback download:", error);
      toast.error("Failed to download. Please try again or contact support.");
    }
  };

  const handleEdit = () => {
    if (onEdit) onEdit(material);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(material.id);
  };

  const handleAdvertClick = (advert: Advert) => {
    setSelectedAdvert(advert);
  };

  const handleCloseAdvertDetail = () => {
    setSelectedAdvert(null);
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
    <>
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
                className={cn(
                  "w-4 h-4",
                  isCurrentlyBookmarked && "fill-current"
                )}
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
                {material.adverts.length > 1
                  ? "Advertisements"
                  : "Advertisement"}
              </h3>
            </div>
            <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
              {material.adverts.map((advert) => (
                <AdvertCard
                  key={advert.id}
                  advert={advert}
                  isPreview={true}
                  onClick={() => handleAdvertClick(advert)}
                />
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
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikeToggle}
                disabled={isLiking}
                className={cn(
                  "flex items-center gap-2",
                  material.isLiked && "text-blue-600"
                )}
              >
                <ThumbsUp
                  className={cn("w-4 h-4", material.isLiked && "fill-current")}
                />
                <span>{material.likes}</span>
              </Button>
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
                  {material.resource?.resourceType === "url" ||
                  material.resource?.resourceType === "GDrive" ? (
                    <>
                      <Eye className="mr-2 w-4 h-4" />
                      Visit Resource
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 w-4 h-4" />
                      {isDownloading ? "Downloading..." : "Download Material"}
                    </>
                  )}
                </Button>

                {isDownloading &&
                  material.resource?.resourceType === "upload" && (
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

      {/* Advert Detail Modal */}
      {selectedAdvert && (
        <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 p-4">
          <div className="bg-white shadow-xl rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <AdvertDetail
              advertId={selectedAdvert.id}
              initialAdvert={selectedAdvert}
              onClose={handleCloseAdvertDetail}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default MaterialDetail;
