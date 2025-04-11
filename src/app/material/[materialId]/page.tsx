"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Material } from "@/lib/types/response.type";
import MaterialDetail from "@/components/materials/MaterialDetail";
import { getMaterialById } from "@/api/material.api";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MaterialPage() {
  const { materialId } = useParams();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      if (!materialId || typeof materialId !== "string") {
        setError("Invalid material ID");
        setLoading(false);
        return;
      }

      try {
        const response = await getMaterialById(materialId);
        if (response?.status === "success") {
          setMaterial(response.data);
        } else {
          setError("Failed to load material details");
        }
      } catch (err) {
        console.error("Error fetching material:", err);
        setError("An error occurred while loading the material");
      } finally {
        setLoading(false);
      }
    };

    fetchMaterial();
  }, [materialId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto w-12 h-12 text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading material...</p>
        </div>
      </div>
    );
  }

  if (error || !material) {
    return (
      <div className="flex flex-col justify-center items-center p-4 min-h-screen">
        <div className="bg-red-50 p-6 border border-red-200 rounded-lg max-w-md text-center">
          <h2 className="mb-2 font-bold text-red-600 text-xl">Error</h2>
          <p className="mb-6 text-gray-700">
            {error ||
              "Material not found. It may have been removed or you don't have permission to view it."}
          </p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/" className="flex items-center gap-2">
            <span>← Back to Home</span>
          </Link>
        </Button>
      </div>
      <MaterialDetail material={material} isOwner={false} />
    </div>
  );
}
