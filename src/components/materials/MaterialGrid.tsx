"use client";

import React, { useState, useEffect } from "react";
import { Material } from "@/lib/types/response.type";
import MaterialCard from "./MaterialCard";

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
  // Check which materials have ads
  const materialsWithAds = new Set(
    materials
      .filter((material) => material.adverts && material.adverts.length > 0)
      .map((m) => m.id)
  );

  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {materials.map((material) => (
          <MaterialCard
            key={material.id}
            material={material}
            onClick={onMaterialClick}
            hasAdvert={materialsWithAds.has(material.id)}
            viewMode="list"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {materials.map((material) => (
        <MaterialCard
          key={material.id}
          material={material}
          onClick={onMaterialClick}
          hasAdvert={materialsWithAds.has(material.id)}
          viewMode="grid"
        />
      ))}
    </div>
  );
};

export default MaterialGrid;
