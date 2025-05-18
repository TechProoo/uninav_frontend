"use client";

import { useState, useContext } from "react";
import { useParams, useRouter } from "next/navigation";
import { Material } from "@/lib/types/response.type";
import MaterialDetail from "@/components/materials/MaterialDetail";
import MaterialForm from "@/components/materials/forms/MaterialForm";
import { AuthContext } from "@/contexts/authContext";

export default function MaterialPage() {
  const { materialId } = useParams();
  const [material, setMaterial] = useState<Material | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { user } = useContext(AuthContext) ?? { user: null };

  const handleEdit = (material: Material) => {
    setMaterial(material);
    setIsEditing(true);
  };

  const handleEditCancel = () => {
    setIsEditing(false);
  };

  const handleEditSuccess = (updatedMaterial: Material | Material[]) => {
    const materialToSet = Array.isArray(updatedMaterial) ? updatedMaterial[0] : updatedMaterial;
    if (materialToSet) {
      setMaterial(materialToSet);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    // After successful delete, redirect to dashboard
    router.push("/dashboard/materials");
  };

  return (
    <div className="mx-auto px-4 py-8 max-w-6xl">
      {isEditing && material ? (
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
          materialId={materialId as string}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
