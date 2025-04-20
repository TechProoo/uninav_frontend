"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Collection, Material } from "@/lib/types/response.type";
import { getCollection } from "@/api/collection.api";
import MaterialCard from "@/components/materials/MaterialCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Eye, FolderClosed, Globe, Grid2X2, List } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

interface CollectionPageProps {
  params: {
    id: string;
  };
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const fetchCollection = async () => {
    try {
      setIsLoading(true);
      const response = await getCollection(params.id);
      setCollection(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch collection",
        variant: "destructive",
      });
      router.push("/collections");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, [params.id]);

  const handleMaterialRemoved = (materialId: string) => {
    if (collection) {
      setCollection({
        ...collection,
        materials: collection.materials.filter((m) => m.id !== materialId),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto py-8 container">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="border-primary border-t-2 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!collection) {
    return null;
  }

  return (
    <div className="mx-auto py-8 container">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/collections")}
      >
        <ArrowLeft className="mr-2 w-4 h-4" />
        Back to Collections
      </Button>

      <PageHeader
        heading={collection.label}
        description={collection.description || "No description provided"}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <FolderClosed className="w-4 h-4" />
            {collection.materials?.length || 0} materials
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Globe className="w-4 h-4" />
            {collection.visibility}
          </div>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Eye className="w-4 h-4" />
            View as:
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              onClick={() => setViewMode("grid")}
            >
              <Grid2X2
                className={`h-4 w-4 ${
                  viewMode === "grid" ? "text-primary" : "text-gray-500"
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-1"
              onClick={() => setViewMode("list")}
            >
              <List
                className={`h-4 w-4 ${
                  viewMode === "list" ? "text-primary" : "text-gray-500"
                }`}
              />
            </Button>
          </div>
        </div>
      </PageHeader>

      {collection.materials?.length === 0 ? (
        <div className="flex flex-col justify-center items-center min-h-[400px] text-center">
          <FolderClosed className="mb-4 w-16 h-16 text-gray-400" />
          <h3 className="mb-2 font-semibold text-xl">No materials yet</h3>
          <p className="mb-4 text-gray-500">
            Start adding materials to your collection
          </p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              : "space-y-4"
          }
        >
          {collection.materials?.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              viewMode={viewMode}
              collectionId={collection.id}
              onRemoveFromCollection={handleMaterialRemoved}
            />
          ))}
        </div>
      )}
    </div>
  );