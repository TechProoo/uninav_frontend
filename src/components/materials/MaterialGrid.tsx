"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getAdvertByMaterialId } from "@/api/advert.api";

interface MaterialGridProps {
  materials: Material[];
  onMaterialClick: (material: Material) => void;
  viewMode?: "grid" | "list";
}

const MaterialGrid: React.FC<MaterialGridProps> = ({
  materials,
  onMaterialClick,
  viewMode = "grid",
}) => {
  const [materialsWithAds, setMaterialsWithAds] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    checkForAds();
  }, [materials]);

  // Check which materials have ads
  const checkForAds = async () => {
    const adsSet = new Set<string>();

    // Process in batches to prevent too many parallel requests
    for (const material of materials) {
      try {
        const response = await getAdvertByMaterialId(material.id);
        if (response?.status === "success" && response.data.length > 0) {
          adsSet.add(material.id);
        }
      } catch (error) {
        console.error(`Error checking ads for material ${material.id}:`, error);
      }
    }

    setMaterialsWithAds(adsSet);
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
      <div className="space-y-4">
        {materials.map((material) => (
          <Card
            key={material.id}
            className="bg-white/80 hover:shadow-lg backdrop-blur-sm p-4 transition-shadow cursor-pointer"
            onClick={() => onMaterialClick(material)}
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
                    {materialsWithAds.has(material.id) && (
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
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {materials.map((material) => (
        <Card
          key={material.id}
          className="bg-white/80 hover:shadow-lg backdrop-blur-sm p-4 transition-shadow cursor-pointer"
          onClick={() => onMaterialClick(material)}
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

          <div className="flex flex-wrap gap-2 mb-2">
            {material.targetCourse && (
              <Badge
                variant="secondary"
                className="flex items-center gap-1 w-fit"
              >
                <BookOpen className="w-3 h-3" />
                {material.targetCourse.courseCode}
              </Badge>
            )}

            {materialsWithAds.has(material.id) && (
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
      ))}
    </div>
  );
};

export default MaterialGrid;
