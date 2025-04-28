"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Collection } from "@/lib/types/response.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCollection, updateCollection } from "@/api/collection.api";
import { SelectCourse } from "@/components/search/SelectCourse";
import toast from "react-hot-toast";

interface CollectionFormProps {
  collection?: Collection;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CollectionForm = ({
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
    targetCourseId: collection?.targetCourseId || "",
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
        <label className="block font-medium">Target Course (Optional)</label>
        <SelectCourse
          onChange={(courseId) => {
            setFormData((prev) => ({ ...prev, targetCourseId: courseId }));
          }}
          currentValue={formData.targetCourseId}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="visibility" className="block font-medium">
          Visibility
        </label>
        <select
          id="visibility"
          name="visibility"
          value={formData.visibility}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, visibility: e.target.value }))
          }
          className="bg-background disabled:opacity-50 px-3 py-2 border border-input rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 w-full text-sm disabled:cursor-not-allowed"
        >
          <option value="public">Public</option>
          <option value="private">Private</option>
        </select>
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
export default CollectionForm;
