"use client";

import React from "react";
import { Material } from "@/lib/types/response.type";
import {
  Clock,
  BookOpen,
  Bookmark,
  BookmarkPlus,
  FileText,
} from "lucide-react";

interface MaterialGridProps {
  title: string;
  materials: Material[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MaterialGrid: React.FC<MaterialGridProps> = ({
  title,
  materials,
  loading,
  error,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (loading) {
    return (
      <div className="my-8">
        <h2 className="mb-6 font-semibold text-2xl">{title}</h2>
        <div className="flex justify-center p-10">
          <div className="border-b-2 border-blue-700 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8">
        <h2 className="mb-6 font-semibold text-2xl">{title}</h2>
        <div className="bg-red-100 px-4 py-3 border border-red-400 rounded text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="my-8">
        <h2 className="mb-6 font-semibold text-2xl">{title}</h2>
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

  return (
    <div className="my-8">
      <h2 className="mb-6 font-semibold text-2xl">{title}</h2>
      <div className="gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {materials.map((material) => (
          <div
            key={material.id}
            className="bg-white shadow-md hover:shadow-lg rounded-lg overflow-hidden transition-all duration-300"
          >
            {material.resource?.resourceAddress ? (
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
                  >
                    <BookmarkPlus className="w-5 h-5 text-blue-600" />
                  </button>
                </div>

                {material.creator?.department?.name && (
                  <div className="right-0 bottom-0 left-0 absolute bg-gradient-to-t from-black/70 to-transparent p-3">
                    <span className="font-medium text-white text-sm">
                      {material.creator.department.name}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative flex justify-center items-center bg-gradient-to-r from-blue-50 to-indigo-50 h-48">
                <FileText className="w-16 h-16 text-blue-300" />
                <div className="top-0 right-0 absolute p-2">
                  <button
                    className="bg-white hover:bg-blue-50 shadow-md p-1.5 rounded-full transition-colors"
                    title="Bookmark this material"
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
                    <BookOpen className="mr-1 w-3.5 h-3.5" />{" "}
                    {material.viewCount || 0}
                  </span>
                  <button className="font-medium text-blue-600 hover:text-blue-800 text-sm">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="inline-flex isolate shadow-sm rounded-md">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex relative items-center bg-white hover:bg-gray-50 disabled:opacity-50 px-3 py-2 border border-gray-300 rounded-l-md font-medium text-gray-500 text-sm disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                  currentPage === page
                    ? "bg-blue-50 text-blue-600 z-10 border-blue-500"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex relative items-center bg-white hover:bg-gray-50 disabled:opacity-50 px-3 py-2 border border-gray-300 rounded-r-md font-medium text-gray-500 text-sm disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MaterialGrid;
