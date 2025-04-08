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
} from "lucide-react";
import { Button } from "../ui/button";
import { getMaterialDownloadUrl } from "@/api/material.api";
import { getAdvertByMaterialId } from "@/api/advert.api";
import AdvertCard from "./AdvertCard";

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
  const [adverts, setAdverts] = useState<Advert[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (material && material.id) {
      fetchAdverts();
    }
  }, [material]);

  const fetchAdverts = async () => {
    try {
      setIsLoading(true);
      const response = await getAdvertByMaterialId(material.id);

      if (response && response.status === "success") {
        setAdverts(response.data);
      }
    } catch (error) {
      console.error("Error fetching adverts for material:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await getMaterialDownloadUrl(material.id);
      if (response?.data.url) {
        window.open(response.data.url, "_blank");
      }
    } catch (error) {
      console.error("Error downloading material:", error);
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
        <div className="flex gap-2">
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

      {/* Display associated advert if available */}
      {adverts.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-lg">Advertisement</h3>
          </div>
          <AdvertCard advert={adverts[0]} isPreview={true} />
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
            <Button
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 mt-4 w-full"
            >
              <Download className="mr-2 w-4 h-4" />
              Download Material
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MaterialDetail;
