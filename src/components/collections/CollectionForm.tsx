"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Collection } from "@/lib/types/response.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createCollection, updateCollection } from "@/api/collection.api";
import toast from "react-hot-toast";

interface CollectionFormProps {
  collection?: Collection;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const CollectionForm = ({
  collection,
  onSuccess,
  onCancel,
}: CollectionFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    label: collection?.label || "",
    description: collection?.description || "",
    visibility: collection?.visibility || "public",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label || formData.label.length < 3) {
      toast.error("Label must be at least 3 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      if (collection) {
        await updateCollection(collection.id, formData);
        toast.success("Collection updated successfully");
      } else {
        await createCollection(formData);
        toast.success("Collection created successfully");
      }
      onSuccess?.();
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to save collection");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block font-medium">Label</label>
        <Input
          placeholder="Enter collection label"
          value={formData.label}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, label: e.target.value }))
          }
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Description</label>
        <Textarea
          placeholder="Describe your collection"
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <label className="block font-medium">Visibility</label>
        <Select
          value={formData.visibility}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, visibility: value }))
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

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? collection
              ? "Updating..."
              : "Creating..."
            : collection
              ? "Update Collection"
              : "Create Collection"}
        </Button>
      </div>
    </form>
  );
};
