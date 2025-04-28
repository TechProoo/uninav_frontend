"use client";

import React from "react";
import { Collection } from "@/lib/types/response.type";
import CollectionCard from "@/components/collections/CollectionCard";

interface CollectionGridProps {
  collections: Collection[];
  onCollectionClick?: (collection: Collection) => void;
  onDelete?: (id: string) => void;
  onEdit?: (collection: Collection) => void;
  viewMode?: "grid" | "list";
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  collections,
  onCollectionClick,
  onDelete,
  onEdit,
  viewMode = "grid",
}) => {
  if (viewMode === "list") {
    return (
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        {collections.map((collection) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            onCollectionClick={onCollectionClick}
            onDelete={onDelete}
            onEdit={onEdit}
            viewMode="list"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => (
        <CollectionCard
          key={collection.id}
          collection={collection}
          onCollectionClick={onCollectionClick}
          onDelete={onDelete}
          onEdit={onEdit}
          viewMode="grid"
        />
      ))}
    </div>
  );
};
