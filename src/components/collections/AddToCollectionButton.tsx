"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCollections, addToCollection } from "@/api/collection.api";
import toast from "react-hot-toast";

interface AddToCollectionButtonProps {
  materialId: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  showIcon?: boolean;
}

const AddToCollectionButton: React.FC<AddToCollectionButtonProps> = ({
  materialId,
  variant = "outline",
  size = "sm",
  showIcon = true,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: collections = [], isLoading } = useQuery({
    queryKey: ["collections"],
    queryFn: getAllCollections,
  });

  const addMutation = useMutation({
    mutationFn: addToCollection,
    onSuccess: () => {
      toast.success("Added to collection");
      setIsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["collections"] });
    },
    onError: () => {
      toast.error("Failed to add to collection");
    },
  });

  const handleAddToCollection = (collectionId: string) => {
    addMutation.mutate({ collectionId, materialId });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className="gap-2">
          {showIcon && <FolderPlus className="w-4 h-4" />}
          Add to Collection
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
          <DialogDescription>
            Choose a collection to add this material to
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="border-b-2 border-blue-600 rounded-full w-8 h-8 animate-spin" />
            </div>
          ) : collections.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">No collections found</p>
              <Button
                variant="link"
                onClick={() => {
                  setIsDialogOpen(false);
                  // You could navigate to collections page here
                }}
              >
                Create a collection first
              </Button>
            </div>
          ) : (
            <div className="gap-2 grid">
              {collections.map((collection) => (
                <Button
                  key={collection.id}
                  variant="outline"
                  className="justify-start gap-2 w-full"
                  onClick={() => handleAddToCollection(collection.id)}
                  disabled={addMutation.isPending}
                >
                  <FolderPlus className="w-4 h-4" />
                  {collection.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddToCollectionButton;
