"use client";

import React from "react";
import { Collection } from "@/lib/types/response.type";
import CollectionCard from "./CollectionCard";

interface CollectionGridProps {
  collections: Collection[];
  onCollectionClick?: (collection: Collection) => void;
  viewMode?: "grid" | "list";
}

export const CollectionGrid = ({
  collections,
  onCollectionClick,
  viewMode = "grid",
}: CollectionGridProps) => {
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {collections.map((collection) => (
          <div
            key={collection.id}
            onClick={() => onCollectionClick?.(collection)}
            className="cursor-pointer"
          >
            <CollectionCard collection={collection} viewMode="list" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {collections.map((collection) => (
        <div
          key={collection.id}
          onClick={() => onCollectionClick?.(collection)}
          className="cursor-pointer"
        >
          <CollectionCard collection={collection} viewMode="grid" />
        </div>
      ))}
    </div>
  );
};
