"use client";

import { useState, useEffect, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { Material } from "@/lib/types/response.type";
import MaterialDetail from "@/components/materials/MaterialDetail";
import MaterialForm from "@/components/materials/forms/MaterialForm";
import { getMaterialById } from "@/api/material.api";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuthContext } from "@/contexts/authContext";
import BackButton from "@/components/ui/BackButton";

export default function MaterialPage() {
  const { materialId } = useParams();
  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { user } = useContext(AuthContext) ?? { user: null };

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

  const isOwner = user && material?.creatorId === user.id ? true : undefined;

  const handleEdit = (material: Material) => {
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSuccess = (updatedMaterial: Material) => {
    setMaterial(updatedMaterial);
    setIsEditing(false);
  };

  const handleDelete = () => {
    // After successful delete, redirect to dashboard
    router.push("/dashboard/materials");
  };

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
        <BackButton />
      </div>

      {isEditing ? (
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="mb-4 font-medium text-2xl">Edit Material</h2>
          <MaterialForm
            initialData={material}
            onSuccess={handleEditSuccess}
            onCancel={handleEditCancel}
          />
        </div>
      ) : (
        <MaterialDetail
          material={material}
          isOwner={isOwner}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
