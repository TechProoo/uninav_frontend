import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  addMaterialToCollection,
  addNestedCollection,
  getMyCollections,
  createCollection,
} from "@/api/collection.api";
import toast from "react-hot-toast";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Collection } from "@/lib/types/response.type";
import { SelectCollectionModal } from "@/components/collections/SelectCollectionModal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { ArrowLeft, Plus } from "lucide-react";

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
  const [createMode, setCreateMode] = useState<boolean>(false);
  const [newCollection, setNewCollection] = useState({
    label: "",
    description: "",
    visibility: "public"
  });

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

  const handleCreateCollection = async () => {
    if (!newCollection.label || newCollection.label.length < 3) {
      toast.error("Label must be at least 3 characters");
      return;
    }

    try {
      const response = await createCollection(newCollection);
      if (response?.status === "success") {
        toast.success("Collection created successfully");
        // Add the material/collection to the newly created collection
        await handleAddToCollection(response.data.id);
        setCreateMode(false);
        fetchCollections();
      } else {
        toast.error("Failed to create collection");
      }
    } catch (error: any) {
      console.error("Error creating collection:", error);
      toast.error(
        error.message || "An error occurred while creating the collection"
      );
    }
  };

  const renderSelectCollection = () => (
    <motion.div
      initial={{ x: createMode ? -500 : 0 }}
      animate={{ x: 0 }}
      exit={{ x: -500 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-4">
        <h2 className="font-medium text-lg">Add to Collection</h2>
        
        {loading ? (
          <div className="py-2 text-gray-500 text-center">
            Loading collections...
          </div>
        ) : collections.length === 0 ? (
          <div className="py-2 text-gray-500 text-center">
            You don't have any collections yet. Create one now!
          </div>
        ) : (
          <SelectCollectionModal
            onChange={setSelectedId}
            value={selectedId}
            excludeIds={excludeIds}
          />
        )}

        <div className="flex justify-between items-center pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-1"
            onClick={() => setCreateMode(true)}
          >
            <Plus size={16} /> New Collection
          </Button>
          
          <div className="flex gap-2">
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
      </div>
    </motion.div>
  );

  const renderCreateCollection = () => (
    <motion.div
      initial={{ x: !createMode ? 500 : 0 }}
      animate={{ x: 0 }}
      exit={{ x: 500 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="p-0 h-8 w-8"
          onClick={() => setCreateMode(false)}
        >
          <ArrowLeft size={16} />
        </Button>
        <h2 className="font-medium text-lg">Create New Collection</h2>
      </div>

      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <label className="block font-medium text-sm">Label</label>
          <Input
            placeholder="Enter collection label"
            value={newCollection.label}
            onChange={(e) =>
              setNewCollection((prev) => ({ ...prev, label: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-sm">Description</label>
          <Textarea
            placeholder="Describe your collection"
            value={newCollection.description}
            onChange={(e) =>
              setNewCollection((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-sm">Visibility</label>
          <Select
            value={newCollection.visibility}
            onValueChange={(value) =>
              setNewCollection((prev) => ({ ...prev, visibility: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setCreateMode(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleCreateCollection}
          >
            Create & Add
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">Add to Collection</DialogTitle>
      <DialogContent className="sm:max-w-md overflow-hidden">
        {createMode ? renderCreateCollection() : renderSelectCollection()}
      </DialogContent>
    </Dialog>
  );
};
