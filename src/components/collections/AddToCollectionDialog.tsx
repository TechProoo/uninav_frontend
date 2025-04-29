import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  addMaterialToCollection,
  addNestedCollection,
  getMyCollections,
} from "@/api/collection.api";
import toast from "react-hot-toast";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Collection } from "@/lib/types/response.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddToCollectionDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: string;
  itemType: "material" | "collection";
  excludeIds?: string[];
}

export const AddToCollectionDialog = ({
  isOpen,
  onOpenChange,
  itemId,
  itemType,
  excludeIds = [],
}: AddToCollectionDialogProps) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch collections when the dialog opens
  useEffect(() => {
    if (isOpen) {
      fetchCollections();
    }
  }, [isOpen]);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      const response = await getMyCollections();
      // Filter out excluded IDs (like the current collection when nesting)
      const filteredCollections = response.data.filter(
        (c) => !excludeIds.includes(c.id)
      );
      setCollections(filteredCollections);
    } catch (error) {
      console.error("Error fetching collections:", error);
      toast.error("Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCollection = async (collectionId: string) => {
    try {
      let response;
      if (itemType === "material") {
        response = await addMaterialToCollection(collectionId, itemId);
      } else {
        if (collectionId === itemId) {
          toast.error("Cannot nest a collection inside itself");
          return;
        }
        response = await addNestedCollection(collectionId, itemId);
      }

      if (response?.status === "success") {
        toast.success("Added to collection successfully");
        onOpenChange(false);
      } else {
        toast.error("Failed to add to collection");
      }
    } catch (error: any) {
      console.error("Error adding to collection:", error);
      toast.error(
        error.message || "An error occurred while adding to collection"
      );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Add to Collection</DialogTitle>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-4">
          <h2 className="font-medium text-lg">Add to Collection</h2>

          {loading ? (
            <div className="py-2 text-gray-500 text-center">
              Loading collections...
            </div>
          ) : collections.length === 0 ? (
            <div className="py-2 text-gray-500 text-center">
              You don't have any collections yet. Create one first!
            </div>
          ) : (
            <Select onValueChange={setSelectedId} value={selectedId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a collection" />
              </SelectTrigger>
              <SelectContent position="popper">
                {collections.map((collection) => (
                  <SelectItem key={collection.id} value={collection.id}>
                    {collection.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={!selectedId || loading}
              onClick={() => handleAddToCollection(selectedId)}
            >
              Add to Collection
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
