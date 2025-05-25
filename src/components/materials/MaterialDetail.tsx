"use client";

import React, { useState, useEffect } from "react";
import Card from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge";
import {
  Material,
  VisibilityEnum,
  RestrictionEnum,
  Advert,
  Collection,
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
  Share2,
  Link as LinkIcon,
  Check,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  getMaterialDownloadUrl,
  incrementDownloadCount,
  likeOrUnlikeMaterial,
  getMaterialById,
  deleteMaterial,
} from "@/api/material.api";
import AdvertCard from "./AdvertCard";
import { useBookmarks } from "@/contexts/bookmarksContext";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useAuth } from "@/contexts/authContext";
import { useRouter } from "next/navigation";
import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { ResourceType } from "@/lib/types/response.type";
import AdvertDetail from "./AdvertDetail";
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
import BackButton from "../ui/BackButton";
import SkeletonLoader from "@/components/ui/SkeletonLoader";

interface MaterialDetailProps {
  materialId: string;
  isOwner?: boolean;
  onEdit?: (material: Material) => void;
  onDelete?: (materialId: string) => void;
  onClose?: () => void;
}

const MaterialDetail: React.FC<MaterialDetailProps> = ({
  materialId,
  isOwner: isOwnerProp = false,
  onEdit,
  onDelete,
  onClose,
}) => {
  const [material, setMaterial] = useState<Required<Material> | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [selectedAdvert, setSelectedAdvert] = useState<Advert | null>(null);

  // New states for sharing functionality
  const [shareLoading, setShareLoading] = useState(false);
  const [downloadLinkLoading, setDownloadLinkLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const router = useRouter();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Get user context
  const { user } = useAuth();

  // Combine prop-based ownership with detected ownership
  const [detectedIsOwner, setDetectedIsOwner] = useState(false);

  // Check if material is bookmarked
  const isCurrentlyBookmarked = material ? isBookmarked(material.id) : false;

  useEffect(() => {
    if (user && material && user.id === material.creatorId) {
      setDetectedIsOwner(true);
    }
  }, [user, material]);

  // Use either the prop or detected ownership
  const isOwner = isOwnerProp || detectedIsOwner;

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        setIsLoading(true);
        const response = await getMaterialById(materialId);
        if (response?.status === "success") {
          setMaterial(response.data as Required<Material>);
        } else {
          toast.error("Failed to load material details");
        }
      } catch (error) {
        console.error("Error fetching material data:", error);
        toast.error("Failed to load material details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterial();
  }, [materialId]);

  if (isLoading || !material) {
    return (
      <Card className="space-y-6 sm:space-y-8 bg-white/80 shadow-md backdrop-blur-sm mx-auto p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl max-w-4xl">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start pt-8 sm:pt-0">
          <div className="flex items-start gap-2 sm:gap-4">
            <SkeletonLoader shape="rect" width="48px" height="48px" />
            <div>
              <SkeletonLoader width="200px" height="24px" className="mb-2" />
              <SkeletonLoader width="150px" height="16px" />
            </div>
          </div>
          <div className="flex items-end flex-col gap-2">
            <SkeletonLoader width="80px" height="30px" />
            <SkeletonLoader shape="circle" width="30px" height="30px" />
          </div>
        </div>

        {/* Edit/Delete Controls Skeleton (conditionally rendered based on ownership, so might not always show) */}
        {/* We can add a placeholder if isOwner is not determined yet, or just omit */}

        {/* Advertisement Section Skeleton (conditional) */}
        {/* For simplicity, we can show a generic placeholder if adverts are expected */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <SkeletonLoader shape="circle" width="20px" height="20px" />
            <SkeletonLoader width="150px" height="20px" />
          </div>
          <div className="gap-3 sm:gap-4 grid md:grid-cols-2">
            <SkeletonLoader height="100px" />
            <SkeletonLoader height="100px" />
          </div>
        </div>
        

        {/* Main Content Grid Skeleton */}
        <div className="gap-6 sm:gap-8 grid md:grid-cols-2">
          {/* Left Column Skeleton */}
          <div className="space-y-4 sm:space-y-6">
            <section>
              <SkeletonLoader width="100px" height="20px" className="mb-2" />
              <SkeletonLoader height="16px" />
              <SkeletonLoader height="16px" className="mt-1 w-5/6" />
            </section>
            <section>
              <SkeletonLoader width="80px" height="20px" className="mb-2" />
              <SkeletonLoader height="16px" />
            </section>
            <section>
              <SkeletonLoader width="60px" height="20px" className="mb-2" />
              <div className="flex flex-wrap gap-1 sm:gap-2">
                <SkeletonLoader width="50px" height="24px" />
                <SkeletonLoader width="60px" height="24px" />
                <SkeletonLoader width="70px" height="24px" />
              </div>
            </section>
          </div>

          {/* Right Column Skeleton */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <SkeletonLoader width="80px" height="20px" />
              <SkeletonLoader width="100px" height="20px" />
              <SkeletonLoader width="70px" height="20px" />
            </div>
            <div className="space-y-1">
              <SkeletonLoader width="120px" height="16px" />
              <SkeletonLoader width="150px" height="16px" className="mt-1" />
            </div>
            <SkeletonLoader height="40px" className="mt-2" />
          </div>
        </div>

        {/* Share Section Skeleton */}
        <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-6 border-gray-200 border-t">
          <SkeletonLoader width="150px" height="20px" className="mb-2" />
          <SkeletonLoader height="40px" />
          <SkeletonLoader height="40px" className="mt-2" />
        </div>

        {/* Collections Section Skeleton (conditional) */}
         <div className="mt-6 sm:mt-10">
          <SkeletonLoader width="200px" height="24px" className="mb-2 sm:mb-4" />
          <div className="gap-3 sm:gap-4 grid grid-cols-2 md:grid-cols-3">
            <SkeletonLoader height="120px" />
            <SkeletonLoader height="120px" />
            <SkeletonLoader height="120px" />
          </div>
        </div>
      </Card>
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
    if (!user) {
      toast.error("Please log in to like this material");
      return;
    }
    if (isLiking || !material) return;

    try {
      setIsLiking(true);
      // Optimistic update
      setMaterial((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          likes: prev.likes + (prev.isLiked ? -1 : 1),
          isLiked: !prev.isLiked,
        } as Required<Material>;
      });

      const response = await likeOrUnlikeMaterial(material.id);
      if (response?.status === "success") {
        // Update with actual server state
        setMaterial((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            likes: response.data.likesCount,
            isLiked: response.data.liked,
          } as Required<Material>;
        });
      }
    } catch (error) {
      // Revert optimistic update on error
      setMaterial((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          likes: prev.likes + (prev.isLiked ? 1 : -1),
          isLiked: !prev.isLiked,
        } as Required<Material>;
      });
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
        setMaterial((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            downloads: prev.downloads + 1,
          } as Required<Material>;
        });

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
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await deleteMaterial(material.id);
      if (response?.status === "success") {
        toast.success("Material deleted successfully");
        if (onDelete) onDelete(material.id);
        if (onClose) onClose(); // Close the detail view after deletion
      } else {
        toast.error("Failed to delete material");
      }
    } catch (error) {
      console.error("Error deleting material:", error);
      toast.error("Failed to delete material. Please try again.");
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  const handleAdvertClick = (advert: Advert) => {
    setSelectedAdvert(advert);
  };

  const handleCloseAdvertDetail = () => {
    setSelectedAdvert(null);
  };

  const handleUsernameClick = () => {
    router.push(`/profile/${material.creator.username}`);
  };

  // Copy to clipboard helper function
  const copyToClipboard = async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(successMessage);
      toast.success(successMessage);

      // Clear the success message after 2 seconds
      setTimeout(() => {
        setCopySuccess(null);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy to clipboard");
    }
  };

  // Handle share material
  const handleShareMaterial = async () => {
    setShareLoading(true);
    try {
      const host = typeof window !== "undefined" ? window.location.origin : "";
      const shareUrl = `${host}/material/${material.id}`;
      await copyToClipboard(shareUrl, "Material link copied to clipboard!");
    } finally {
      setShareLoading(false);
    }
  };

  // Handle get download link
  const handleGetDownloadLink = async () => {
    if (downloadLinkLoading) return;

    try {
      setDownloadLinkLoading(true);
      const response = await getMaterialDownloadUrl(material.id);
      if (!response?.data?.url) {
        throw new Error("Failed to get download URL");
      }

      await copyToClipboard(
        response.data.url,
        "Download link copied to clipboard!"
      );
    } catch (error) {
      console.error("Error getting download link:", error);
      toast.error("Failed to get download link. Please try again.");
    } finally {
      setDownloadLinkLoading(false);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />;
      case "video":
        return <FileIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />;
      case "image":
        return <FileIcon className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />;
      default:
        return <FileIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />;
    }
  };

  return (
    <Card className="space-y-6 sm:space-y-8 bg-white/80 shadow-md backdrop-blur-sm mx-auto p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl max-w-4xl">
      
      
      {/* Header Section */}
      <div className="flex justify-between items-start pt-8 sm:pt-0">
        <div className="flex items-start gap-2 sm:gap-4">
          {getFileIcon(material.type)}
          <div>
            <h1 className="font-semibold text-gray-900 text-lg sm:text-xl md:text-2xl">
              {material.label}
            </h1>
            <p className="mt-1 text-gray-500 text-xs sm:text-sm">
              by{" "}
              <span 
                className="text-blue-600 hover:text-blue-800 cursor-pointer underline decoration-dotted underline-offset-2"
                onClick={handleUsernameClick}
              >
                {material.creator.firstName} {material.creator.lastName}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-end flex-col">
        <BackButton  label="Back" className="text-xs sm:text-sm" />
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
              className={cn("w-4 h-4 sm:w-5 sm:h-5", isCurrentlyBookmarked && "fill-current")}
            />
          </Button>
        </div>
      </div>

      {/* Edit/Delete Controls */}
      {isOwner && (
        <div className="flex justify-end items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={handleEdit}
            className="flex items-center gap-1 text-xs sm:text-sm hover:bg-[#003666] border-[#003666] text-[#003666] hover:text-white transition"
          >
            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            Edit
          </Button>
          <Button
            variant="outline"
            onClick={handleDelete}
            className="flex items-center gap-1 text-xs sm:text-sm hover:bg-red-600 border-red-600 text-red-600 hover:text-white transition"
            disabled={isDeleting}
          >
            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </div>
      )}

      {/* Advertisement Section */}
      {(material.adverts ?? []).length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2 sm:mb-3 text-blue-600">
            <Megaphone className="w-4 h-4 sm:w-5 sm:h-5" />
            <h3 className="font-semibold text-base sm:text-lg">
              {(material.adverts ?? []).length > 1
                ? "Advertisements"
                : "Advertisement"}
            </h3>
          </div>
          <div className="gap-3 sm:gap-4 grid md:grid-cols-2">
            {(material.adverts ?? []).map((advert) => (
              <AdvertCard
                key={advert.id}
                advert={advert}
                isPreview
                onClick={() => handleAdvertClick(advert)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="gap-6 sm:gap-8 grid md:grid-cols-2">
        {/* Left Column: Description, Course, Tags */}
        <div className="space-y-4 sm:space-y-6">
          <section>
            <h3 className="mb-1 sm:mb-2 font-semibold text-gray-800 text-base sm:text-lg">
              Description
            </h3>
            <p className="text-gray-700 text-xs sm:text-sm">
              {material.description || "No description available"}
            </p>
          </section>

          {material.targetCourse && (
            <section>
              <h3 className="mb-1 sm:mb-2 font-semibold text-gray-800 text-base sm:text-lg">
                Course
              </h3>
              <div className="flex items-center gap-2 text-gray-700 text-xs sm:text-sm">
                <Book className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>
                  {material.targetCourse.courseCode} -{" "}
                  {material.targetCourse.courseName}
                </span>
              </div>
            </section>
          )}

          {material.tags?.length > 0 && (
            <section>
              <h3 className="mb-1 sm:mb-2 font-semibold text-gray-800 text-base sm:text-lg">Tags</h3>
              <div className="flex flex-wrap gap-1 sm:gap-2">
                {material.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="flex items-center gap-1 text-xs sm:text-sm"
                  >
                    <Tag className="w-2 h-2 sm:w-3 sm:h-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Stats, Visibility, Download */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-wrap gap-3 sm:gap-4 text-gray-600 text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-2">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>{material.views} Views</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Download className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>
                {material.downloads}{" "}
                {material.resource?.resourceType === ResourceType.UPLOAD
                  ? "Downloads"
                  : "Visits"}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLikeToggle}
              disabled={isLiking}
              className={cn(
                "flex items-center gap-1 sm:gap-2 p-1 h-auto",
                material.isLiked && "text-blue-600"
              )}
            >
              <ThumbsUp
                className={cn("w-3 h-3 sm:w-4 sm:h-4", material.isLiked && "fill-current")}
              />
              <span>{material.likes}</span>
            </Button>
          </div>

          <div className="space-y-1 text-gray-600 text-xs sm:text-sm">
            <div className="flex items-center gap-1 sm:gap-2">
              <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>
                {material.visibility === VisibilityEnum.PUBLIC
                  ? "Public"
                  : "Private"}
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>
                {material.restriction === RestrictionEnum.DOWNLOADABLE
                  ? "Downloadable"
                  : "Read Only"}
              </span>
            </div>
          </div>

          {/* Download Section */}
          {material.restriction === RestrictionEnum.DOWNLOADABLE && (
            <div className="space-y-2">
              <Button
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 w-full text-white text-xs sm:text-sm py-2 h-auto"
                disabled={isDownloading}
              >
                {material.resource?.resourceType === "url" ||
                material.resource?.resourceType === "GDrive" ? (
                  <>
                    <Eye className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                    Visit Resource
                  </>
                ) : (
                  <>
                    <Download className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                    {isDownloading ? "Downloading..." : "Download Material"}
                  </>
                )}
              </Button>
              {isDownloading &&
                material.resource?.resourceType === "upload" && (
                  <Button
                    variant="outline"
                    onClick={handleFallbackDownload}
                    className="w-full text-xs h-auto py-1.5"
                  >
                    If download hasn't started, click here
                  </Button>
                )}
            </div>
          )}
        </div>
      </div>

      {/* Share Section */}
      <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-6 border-gray-200 border-t">
        <h3 className="font-semibold text-gray-800 text-base sm:text-lg">Share Material</h3>

        <Button
          onClick={handleShareMaterial}
          variant="outline"
          className="flex items-center gap-1 sm:gap-2 w-full text-xs sm:text-sm h-auto py-2"
          disabled={shareLoading}
        >
          {shareLoading ? (
            <div className="border-2 border-t-blue-600 rounded-full w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
          ) : copySuccess === "Material link copied to clipboard!" ? (
            <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
          ) : (
            <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
          )}
          <span>Share this material </span>
        </Button>

        {material.restriction === RestrictionEnum.DOWNLOADABLE &&
          material.resource?.resourceType === ResourceType.UPLOAD && (
            <Button
              onClick={handleGetDownloadLink}
              variant="outline"
              className="flex items-center gap-1 sm:gap-2 w-full text-xs sm:text-sm h-auto py-2"
              disabled={downloadLinkLoading}
            >
              {downloadLinkLoading ? (
                <div className="border-2 border-t-blue-600 rounded-full w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
              ) : copySuccess === "Download link copied to clipboard!" ? (
                <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
              ) : (
                <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              )}
              <span>Copy download link (expires in 2 days)</span>
            </Button>
          )}
      </div>

      {/* Collections Section */}
      {(material.collections ?? []).length > 0 && (
        <div className="mt-6 sm:mt-10">
          <h2 className="mb-2 sm:mb-4 font-medium text-gray-800 text-base sm:text-lg">
            Featured in Collections
          </h2>
          <CollectionGrid
            collections={material.collections.map((item) => item.collection)}
            onCollectionClick={(collection) =>
              router.push(`/collection/${collection.id}`)
            }
          />
        </div>
      )}

      {/* Advertisement Detail Modal */}
      {selectedAdvert && (
        <AdvertDetail
          advertId={selectedAdvert.id}
          initialAdvert={selectedAdvert}
          onClose={handleCloseAdvertDetail}
          isOpen={!!selectedAdvert}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              material and remove it from all collections.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default MaterialDetail;
