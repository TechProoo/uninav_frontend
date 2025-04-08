import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Material } from "@/lib/types/response.type";
import {
  toggleMaterialLike,
  getMaterialDownloadUrl,
  deleteMaterial,
} from "@/api/material.api";
import {
  FileText,
  Download,
  ThumbsUp,
  BookOpen,
  Calendar,
  Tag,
  Eye,
  Link,
  Trash,
  Edit,
} from "lucide-react";

interface MaterialDetailProps {
  material: Required<Material>;
  onEdit: (material: Material) => void;
  onDelete: (materialId: string) => void;
  isOwner: boolean;
}

const MaterialDetail: React.FC<MaterialDetailProps> = ({
  material,
  onEdit,
  onDelete,
  isOwner,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(material.likes || 0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLikeToggle = async () => {
    try {
      setIsLoading(true);
      const response = await toggleMaterialLike(material.id);

      if (response && response.status === "success") {
        setIsLiked(response.data.liked);
        setLikesCount(response.data.likesCount);
      } else {
        setError("Failed to update like status");
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      setError("An error occurred while updating like status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setIsLoading(true);
      const response = await getMaterialDownloadUrl(material.id);

      if (response && response.status === "success" && response.data.url) {
        // Open the download url in a new tab
        window.open(response.data.url, "_blank");
      } else {
        setError("Failed to generate download link");
      }
    } catch (err) {
      console.error("Error getting download url:", err);
      setError("An error occurred while generating download link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this material? This action cannot be undone."
      )
    ) {
      try {
        setIsLoading(true);
        const response = await deleteMaterial(material.id);

        if (response && response.status === "success") {
          onDelete(material.id);
        } else {
          setError("Failed to delete material");
        }
      } catch (err) {
        console.error("Error deleting material:", err);
        setError("An error occurred while deleting the material");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="mb-1 font-semibold text-gray-900 text-2xl">
              {material.label}
            </h2>
            <p className="mb-2 font-medium text-blue-600 text-sm">
              {material.type.replace("_", " ")}
            </p>
          </div>

          {isOwner && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(material)}
                disabled={isLoading}
                title="Edit"
              >
                <Edit className="w-4 h-4" />
                <span className="sr-only md:not-sr-only md:ml-2">Edit</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteConfirm}
                disabled={isLoading}
                title="Delete"
              >
                <Trash className="w-4 h-4" />
                <span className="sr-only md:not-sr-only md:ml-2">Delete</span>
              </Button>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 mt-4 p-3 rounded text-red-600">{error}</div>
        )}

        {/* Info Items */}
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 mt-6">
          <div className="flex items-center text-gray-600 text-sm">
            <BookOpen className="mr-2 w-4 h-4" />
            <span>
              Created by: {material.creator.firstName}{" "}
              {material.creator.lastName}
            </span>
          </div>

          <div className="flex items-center text-gray-600 text-sm">
            <Calendar className="mr-2 w-4 h-4" />
            <span>
              Created: {new Date(material.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="flex items-center text-gray-600 text-sm">
            <Eye className="mr-2 w-4 h-4" />
            <span>Views: {material.viewCount || 0}</span>
          </div>

          <div className="flex items-center text-gray-600 text-sm">
            <ThumbsUp className="mr-2 w-4 h-4" />
            <span>Likes: {likesCount}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="sm"
            onClick={handleLikeToggle}
            disabled={isLoading}
          >
            <ThumbsUp className="mr-2 w-4 h-4" />
            {isLiked ? "Liked" : "Like"}
          </Button>

          {material.resource.resourceType === "upload" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isLoading}
            >
              <Download className="mr-2 w-4 h-4" />
              Download
            </Button>
          )}

          {(material.resource.resourceType === "url" ||
            material.resource.resourceType === "GDrive") && (
            <Button
              variant="outline"
              size="sm"
              as="a"
              href={material.resource.resourceAddress}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Link className="mr-2 w-4 h-4" />
              Open Link
            </Button>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="mb-6">
          <h3 className="mb-2 font-medium text-gray-900 text-lg">
            Description
          </h3>
          <p className="text-gray-600">
            {material.description || "No description available"}
          </p>
        </div>

        {material.tags && material.tags.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 font-medium text-gray-900 text-lg">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {material.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-100 px-2.5 py-0.5 rounded text-blue-800 text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="mb-2 font-medium text-gray-900 text-lg">
            Resource Information
          </h3>
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center">
              <FileText className="mr-2 w-5 h-5 text-blue-600" />
              <span className="font-medium">Type:</span>
              <span className="ml-2">{material.resource.resourceType}</span>
            </div>

            {material.resource.resourceAddress && (
              <div className="flex items-center mt-2">
                <Link className="mr-2 w-5 h-5 text-blue-600" />
                <span className="font-medium">Address:</span>
                <a
                  href={material.resource.resourceAddress}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-2 text-blue-600 hover:underline truncate"
                >
                  {material.resource.resourceAddress}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetail;
