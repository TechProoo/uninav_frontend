import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { SelectCollection } from "./SelectCollection";
import { Button } from "@/components/ui/button";
import {
  addMaterialToCollection,
  addNestedCollection,
} from "@/api/collection.api";
import toast from "react-hot-toast";
import { DialogTitle } from "@radix-ui/react-dialog";

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
  excludeIds,
}: AddToCollectionDialogProps) => {
  const [selectedId, setSelectedId] = useState<string>("");

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
          <SelectCollection
            value={selectedId}
            onChange={setSelectedId}
            excludeIds={excludeIds}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={!selectedId}
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
