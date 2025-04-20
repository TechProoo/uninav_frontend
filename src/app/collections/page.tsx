"use client";

import React, { useEffect, useState } from "react";
import { Collection } from "@/lib/types/response.type";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CollectionForm } from "@/components/collections/CollectionForm";
import { CollectionGrid } from "@/components/collections/CollectionGrid";
import { getMyCollections } from "@/api/collection.api";
import { FolderPlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/ui/page-header";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const { toast } = useToast();

  const fetchCollections = async () => {
    try {
      setIsLoading(true);
      const response = await getMyCollections();
      setCollections(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch collections",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleDelete = (id: string) => {
    setCollections((prev) => prev.filter((collection) => collection.id !== id));
  };

  const handleEdit = (collection: Collection) => {
    setEditingCollection(collection);
  };

  return (
    <div className="mx-auto py-8 container">
      <PageHeader
        heading="My Collections"
        description="Create and manage your study material collections"
      >
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <FolderPlus className="w-4 h-4" />
              New Collection
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Collection</DialogTitle>
            </DialogHeader>
            <CollectionForm
              onSuccess={() => {
                setIsCreateOpen(false);
                fetchCollections();
              }}
              onCancel={() => setIsCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </PageHeader>

      <Dialog open={!!editingCollection} onOpenChange={() => setEditingCollection(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          {editingCollection && (
            <CollectionForm
              collection={editingCollection}
              onSuccess={() => {
                setEditingCollection(null);
                fetchCollections();
              }}
              onCancel={() => setEditingCollection(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="border-primary border-t-2 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      ) : collections.length === 0 ? (
        <div className="flex flex-col justify-center items-center min-h-[400px] text-center">
          <FolderPlus className="mb-4 w-16 h-16 text-gray-400" />
          <h3 className="mb-2 font-semibold text-xl">No collections yet</h3>
          <p className="mb-4 text-gray-500">
            Start organizing your study materials by creating a collection
          </p>
          <Button onClick={() => setIsCreateOpen(true)}>
            Create Your First Collection
          </Button>
        </div>
      ) : (
        <CollectionGrid
          collections={collections}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );