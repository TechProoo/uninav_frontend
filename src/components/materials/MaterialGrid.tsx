"use client";

import React from "react";
import { Material } from "@/lib/types/response.type";
import {
  Clock,
  BookOpen,
  BookmarkPlus,
  FileText,
  ThumbsUp,
  ExternalLink,
  Download,
  Eye,
} from "lucide-react";
import { Avatar } from "../ui/avatar";
import { Button } from "@/components/ui/button";

interface MaterialGridProps {
  materials: Material[];
  title?: string;
  loading?: boolean;
  error?: string | null;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onMaterialClick?: (material: Material) => void;
  viewMode?: "grid" | "list";
}

const MaterialGrid: React.FC<MaterialGridProps> = ({
  materials = [],
  title,
  loading = false,
  error = null,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onMaterialClick,
  viewMode = "grid",
}) => {
  if (loading) {
    return (
      <div className="my-8">
        {title && <h2 className="mb-6 font-semibold text-2xl">{title}</h2>}
        <div className="flex justify-center p-10">
          <div className="border-b-2 border-blue-700 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8">
        {title && <h2 className="mb-6 font-semibold text-2xl">{title}</h2>}
        <div className="bg-red-100 px-4 py-3 border border-red-400 rounded text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="my-8">
        {title && <h2 className="mb-6 font-semibold text-2xl">{title}</h2>}
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <BookOpen className="mx-auto w-12 h-12 text-gray-400" />
          <h3 className="mt-2 font-medium text-gray-900 text-lg">
            No materials found
          </h3>
          <p className="mt-1 text-gray-500">
            We couldn't find any materials matching your criteria.
          </p>
        </div>
      </div>
    );
  }

  const handleMaterialClick = (material: Material) => {
    if (onMaterialClick) {
      onMaterialClick(material);
    }
  };

  if (viewMode === "list") {
    return (
      <div className="my-8">
        {title && <h2 className="mb-6 font-semibold text-2xl">{title}</h2>}
        <div className="space-y-4">
          {materials.map((material) => (
            <div
              key={material.id}
              onClick={() => handleMaterialClick(material)}
              className="flex items-center bg-white hover:bg-gray-50 border border-gray-200 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer"
            >
              <div className="flex justify-center items-center bg-gradient-to-r from-blue-50 to-indigo-50 w-16 h-full">
                {material.resource?.resourceType === "url" ? (
                  <ExternalLink className="w-6 h-6 text-blue-500" />
                ) : material.resource?.resourceType === "GDrive" ? (
                  <FileText className="w-6 h-6 text-blue-500" />
                ) : (
                  <Download className="w-6 h-6 text-blue-500" />
                )}
              </div>

              <div className="flex-grow p-4">
                <div className="flex justify-between items-center">
                  <span className="bg-blue-100 px-2 py-0.5 rounded text-blue-800 text-xs">
                    {material.type}
                  </span>
                  <div className="flex items-center space-x-2 text-gray-500 text-xs">
                    <div className="flex items-center">
                      <Eye className="mr-1 w-3.5 h-3.5" />
                      <span>{material.views || 0}</span>
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp className="mr-1 w-3.5 h-3.5" />
                      <span>{material.likes || 0}</span>
                    </div>
                  </div>
                </div>

                <h3 className="mt-1 font-medium text-gray-900">
                  {material.label}
                </h3>

                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6 text-xs">
                      {`${material.creator?.firstName} ${material.creator?.lastName}`}
                    </Avatar>
                    <span className="text-gray-600 text-xs">
                      {material.creator?.firstName} {material.creator?.lastName}
                    </span>
                  </div>

                  <span className="text-gray-500 text-xs">
                    {material.createdAt &&
                      new Date(material.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && onPageChange && (
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="px-3 py-1.5 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onPageChange(Math.min(currentPage + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={title ? "my-8" : ""}>
      {title && <h2 className="mb-6 font-semibold text-2xl">{title}</h2>}
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {materials.map((material) => (
          <div
            key={material.id}
            onClick={() => handleMaterialClick(material)}
            className="bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-all duration-300 cursor-pointer"
          >
            {material.resource?.resourceAddress &&
            material.resource.resourceType === "url" ? (
              <div
                className="relative bg-cover bg-center h-48"
                style={{
                  backgroundImage: `url(${material.resource.resourceAddress})`,
                }}
              >
                <div className="top-0 right-0 absolute p-2">
                  <button
                    className="bg-white hover:bg-blue-50 shadow-md p-1.5 rounded-full transition-colors"
                    title="Bookmark this material"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle bookmark logic here
                    }}
                  >
                    <BookmarkPlus className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative flex justify-center items-center bg-gradient-to-r from-blue-50 to-indigo-50 h-48">
                {material.resource?.resourceType === "GDrive" ? (
                  <FileText className="w-16 h-16 text-blue-300" />
                ) : material.resource?.resourceType === "url" ? (
                  <ExternalLink className="w-16 h-16 text-blue-300" />
                ) : (
                  <Download className="w-16 h-16 text-blue-300" />
                )}
                <div className="top-0 right-0 absolute p-2">
                  <button
                    className="bg-white hover:bg-blue-50 shadow-md p-1.5 rounded-full transition-colors"
                    title="Bookmark this material"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle bookmark logic here
                    }}
                  >
                    <BookmarkPlus className="w-5 h-5 text-blue-600" />
                  </button>
                </div>
              </div>
            )}

            <div className="p-4">
              <div className="flex items-center mb-2">
                <span className="bg-blue-100 px-2 py-0.5 rounded font-medium text-blue-800 text-xs">
                  {material.type}
                </span>
              </div>

              <h3 className="mb-2 font-medium text-gray-900 text-lg line-clamp-2">
                {material.label}
              </h3>
              <p className="mb-3 text-gray-600 text-sm line-clamp-2">
                {material.description || "No description available"}
              </p>

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center text-gray-500 text-xs">
                  <Clock className="mr-1 w-3.5 h-3.5" />
                  <span>
                    {material.createdAt
                      ? new Date(material.createdAt).toLocaleDateString()
                      : "Unknown date"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex items-center text-gray-500 text-xs">
                    <Eye className="mr-1 w-3.5 h-3.5" /> {material.views || 0}
                  </span>
                  <span className="flex items-center text-gray-500 text-xs">
                    <ThumbsUp className="mr-1 w-3.5 h-3.5" />{" "}
                    {material.likes || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="flex justify-center gap-1 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="px-3 py-1.5 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default MaterialGrid;
