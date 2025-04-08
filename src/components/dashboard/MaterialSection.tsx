import React from "react";
import Card from "@/components/ui/card/card";
import { Material } from "@/lib/types/response.type";

interface MaterialSectionProps {
  title: string;
  materials: Material[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const MaterialSection: React.FC<MaterialSectionProps> = ({
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
        <h2 className="mb-4 font-semibold text-2xl">{title}</h2>
        <div className="flex justify-center">
          <div className="border-b-2 border-blue-700 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-8">
        <h2 className="mb-4 font-semibold text-2xl">{title}</h2>
        <div className="bg-red-100 px-4 py-3 border border-red-400 rounded text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (materials.length === 0) {
    return (
      <div className="my-8">
        <h2 className="mb-4 font-semibold text-2xl">{title}</h2>
        <div className="bg-gray-100 px-4 py-3 border border-gray-300 rounded text-gray-700">
          No materials found.
        </div>
      </div>
    );
  }

  return (
    <div className="my-8">
      <h2 className="mb-4 font-semibold text-2xl">{title}</h2>
      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {materials.map((material) => (
          <Card
            key={material.id}
            title={material.title}
            description={material.description || "No description available"}
            imageUrl={
              material.coverImage ||
              "https://via.placeholder.com/300x200?text=No+Image"
            }
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="disabled:opacity-50 px-4 py-2 border rounded"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="disabled:opacity-50 px-4 py-2 border rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterialSection;
