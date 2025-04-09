"use client";

import React, { useEffect } from "react";
import { Material } from "@/lib/types/response.type";
import MaterialGrid from "../materials/MaterialGrid";
import { useRouter } from "next/navigation";
import { getFilteredMaterials } from "@/api/material.api";

const MaterialSection = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [materials, setMaterials] = React.useState<Material[]>([]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const response = await getFilteredMaterials({
        page: 1,
        limit: 6,
      });
      if (response?.status === "success" && response.data.data) {
        setMaterials(response.data.data);
      }
    } catch (err) {
      setError("Failed to load materials");
      console.error("Error fetching materials:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleMaterialClick = (material: Material) => {
    router.push(`/materials/${material.id}`);
  };

  return (
    <div className="my-8">
      <h2 className="mb-6 font-semibold text-2xl">Recent Materials</h2>
      {loading ? (
        <div className="flex justify-center">
          <div className="border-b-2 border-blue-700 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 px-4 py-3 border border-red-400 rounded text-red-700">
          {error}
        </div>
      ) : materials.length === 0 ? (
        <div className="bg-gray-100 px-4 py-3 border border-gray-300 rounded text-gray-700">
          No materials found.
        </div>
      ) : (
        <MaterialGrid
          materials={materials}
          onMaterialClick={handleMaterialClick}
          viewMode="grid"
        />
      )}
    </div>
  );
};

export default MaterialSection;
