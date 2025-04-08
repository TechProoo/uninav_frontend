import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Material,
  MaterialTypeEnum,
  VisibilityEnum,
  RestrictionEnum,
} from "@/lib/types/response.type";
import {
  CreateMaterialDto,
  createMaterial,
  updateMaterial,
} from "@/api/material.api";

interface MaterialFormProps {
  initialData?: Material;
  onSuccess: (material: Material) => void;
  onCancel: () => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({
  initialData,
  onSuccess,
  onCancel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateMaterialDto>({
    label: "",
    description: "",
    type: MaterialTypeEnum.PDF,
    tags: [],
    visibility: VisibilityEnum.PUBLIC,
    restriction: RestrictionEnum.DOWNLOADABLE,
    resourceAddress: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [tagInput, setTagInput] = useState("");

  // Initialize form with existing data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        label: initialData.label,
        description: initialData.description,
        type: initialData.type,
        tags: initialData.tags || [],
        visibility: initialData.visibility,
        restriction: initialData.restriction,
        resourceAddress: initialData.resource?.resourceAddress || "",
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      // Clear resourceAddress when uploading a file
      setFormData((prev) => ({
        ...prev,
        resourceAddress: "",
      }));
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const materialData: CreateMaterialDto = {
        ...formData,
      };

      if (file) {
        materialData.file = file;
      }

      let response;
      if (initialData) {
        response = await updateMaterial(initialData.id, materialData);
      } else {
        response = await createMaterial(materialData);
      }

      if (response && response.status === "success") {
        onSuccess(response.data);
      } else {
        setError("Failed to save material. Please try again.");
      }
    } catch (err) {
      console.error("Error saving material:", err);
      setError("An error occurred while saving. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-sm p-6 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 p-4 rounded text-red-600">{error}</div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="label"
              className="block mb-1 font-medium text-gray-700 text-sm"
            >
              Title *
            </label>
            <input
              id="label"
              name="label"
              type="text"
              required
              value={formData.label}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md w-full"
              placeholder="Material Title"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block mb-1 font-medium text-gray-700 text-sm"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md w-full"
              placeholder="Describe your material..."
            />
          </div>

          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <div>
              <label
                htmlFor="type"
                className="block mb-1 font-medium text-gray-700 text-sm"
              >
                Type *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md w-full"
              >
                {Object.values(MaterialTypeEnum).map((type) => (
                  <option key={type} value={type}>
                    {type.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="visibility"
                className="block mb-1 font-medium text-gray-700 text-sm"
              >
                Visibility
              </label>
              <select
                id="visibility"
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md w-full"
              >
                {Object.values(VisibilityEnum).map((visibility) => (
                  <option key={visibility} value={visibility}>
                    {visibility}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="restriction"
                className="block mb-1 font-medium text-gray-700 text-sm"
              >
                Access Restriction
              </label>
              <select
                id="restriction"
                name="restriction"
                value={formData.restriction}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded-md w-full"
              >
                {Object.values(RestrictionEnum).map((restriction) => (
                  <option key={restriction} value={restriction}>
                    {restriction}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="resourceAddress"
              className="block mb-1 font-medium text-gray-700 text-sm"
            >
              Resource URL
            </label>
            <input
              id="resourceAddress"
              name="resourceAddress"
              type="url"
              value={formData.resourceAddress}
              onChange={handleChange}
              className="p-2 border border-gray-300 rounded-md w-full"
              placeholder="https://example.com/resource"
            />
          </div>

          <div>
            <label
              htmlFor="file"
              className="block mb-1 font-medium text-gray-700 text-sm"
            >
              Upload File
            </label>
            <input
              id="file"
              name="file"
              type="file"
              onChange={handleFileChange}
              className="p-2 border border-gray-300 rounded-md w-full"
            />
            <p className="mt-1 text-gray-500 text-sm">
              You can either provide a URL or upload a file
            </p>
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block mb-1 font-medium text-gray-700 text-sm"
            >
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                id="tagInput"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-grow p-2 border border-gray-300 rounded-md"
                placeholder="Add a tag (press Enter or click Add)"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button type="button" onClick={handleAddTag} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags?.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-blue-100 px-2.5 py-0.5 rounded text-blue-800 text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 pt-4 border-t">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : initialData
              ? "Update Material"
              : "Create Material"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MaterialForm;
