import React, { useState } from "react";
import { Collection } from "@/lib/types/response.type";
import { createCollection, updateCollection } from "@/api/collection.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

interface CollectionFormProps {
  collection?: Collection;
  onSuccess: () => void;
  onCancel: () => void;
}

interface CollectionFormData {
  label: string;
  description: string;
}

const CollectionForm: React.FC<CollectionFormProps> = ({
  collection,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CollectionFormData>({
    label: collection?.label || "",
    description: collection?.description || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.label.trim()) {
      toast.error("Name is required");
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
      onSuccess();
    } catch (error) {
      toast.error(
        collection
          ? "Failed to update collection"
          : "Failed to create collection"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="mb-6 font-bold text-2xl">
        {collection ? "Edit Collection" : "Create Collection"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium text-sm">
            Collection Name
          </label>
          <Input
            name="label"
            value={formData.label}
            onChange={handleChange}
            placeholder="Enter collection name"
            required
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-sm">
            Description (Optional)
          </label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter collection description"
            className="resize-none"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                {collection ? "Updating..." : "Creating..."}
              </>
            ) : collection ? (
              "Save Changes"
            ) : (
              "Create Collection"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CollectionForm;
