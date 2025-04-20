"use client";

import React from "react";
import { Collection, VisibilityEnum } from "@/lib/types/response.type";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Tag, BookmarkIcon, Eye, Lock, Globe } from "lucide-react";

interface CollectionCardProps {
  collection: Collection;
  viewMode?: "grid" | "list";
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  viewMode = "grid",
}) => {
  if (viewMode === "list") {
    return (
      <div className="bg-white/80 hover:bg-white shadow-sm hover:shadow-md p-4 border border-gray-100 rounded-xl transition-all duration-200">
        <div className="flex gap-4">
          <div className="bg-blue-50 p-3 rounded-xl">
            <FolderOpen className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex-grow">
            <h3 className="mb-2 font-semibold text-gray-900">
              {collection.label}
            </h3>
            <p className="mb-3 text-gray-600 text-sm line-clamp-2">
              {collection.description}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                {collection.materials?.length || 0} materials
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-1 text-xs"
              >
                {collection.visibility === VisibilityEnum.PUBLIC ? (
                  <Globe className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                {collection.visibility.toLowerCase()}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 hover:bg-white shadow-sm hover:shadow-md p-4 border border-gray-100 rounded-xl transition-all duration-200">
      <div className="flex items-center gap-3 mb-3">
        <div className="bg-blue-50 p-2 rounded-lg">
          <FolderOpen className="w-5 h-5 text-blue-500" />
        </div>
        <Badge variant="secondary" className="text-xs">
          {collection.materials?.length || 0} materials
        </Badge>
      </div>
      <h3 className="mb-2 font-semibold text-gray-900 line-clamp-2">
        {collection.label}
      </h3>
      <p className="mb-3 text-gray-600 text-sm line-clamp-2">
        {collection.description}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            {collection.visibility === VisibilityEnum.PUBLIC ? (
              <Globe className="w-3 h-3" />
            ) : (
              <Lock className="w-3 h-3" />
            )}
            {collection.visibility.toLowerCase()}
          </Badge>
        </div>
        <p className="text-gray-500 text-xs">
          by @{collection.creator?.username}
        </p>
      </div>
    </div>
  );
};

export default CollectionCard;
