"use client";
import React, { useState, useEffect } from "react";
import { Upload, Megaphone, PlusCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Material,
  MaterialTypeEnum,
  VisibilityEnum,
  RestrictionEnum,
  Course,
  Advert,
} from "@/lib/types/response.type";
import {
  CreateMaterialDto,
  createMaterial,
  updateMaterial,
} from "@/api/material.api";
import { CreateFreeAdvertDto, createFreeAdvert } from "@/api/advert.api";
import { getCourses } from "@/api/course.api";
import { useDropzone } from "react-dropzone";
import { SelectCourse } from "@/components/search/selectCourse";
import toast from "react-hot-toast";

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
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [includeAdvert, setIncludeAdvert] = useState(false);

  // Define the maximum number of free adverts allowed per material
  const MAX_FREE_ADVERTS = 3;

  // Track existing and new adverts separately
  const [existingAdverts, setExistingAdverts] = useState<Advert[]>([]);
  const [newAdverts, setNewAdverts] = useState<
    {
      label: string;
      description: string;
      image: File | null;
      imagePreview: string | null;
    }[]
  >([]);

  const [formData, setFormData] = useState<CreateMaterialDto>({
    label: "",
    description: "",
    type: MaterialTypeEnum.PDF,
    tags: [],
    visibility: VisibilityEnum.PUBLIC,
    restriction: RestrictionEnum.DOWNLOADABLE,
    resourceAddress: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

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
        targetCourseId: initialData.targetCourseId || undefined,
      });

      if (initialData.targetCourse) {
        const { id, courseName, courseCode } = initialData.targetCourse;
        const course = courses.find((c) => c.id === id) || {
          id,
          courseName,
          courseCode,
          description: "",
          reviewStatus: "",
          reviewedBy: null,
          departmentId: "",
          level: 100,
        };
        setSelectedCourse(course);
      }

      // Initialize existing adverts if available
      if (initialData.adverts && initialData.adverts.length > 0) {
        setExistingAdverts(initialData.adverts);
        setIncludeAdvert(true);
      }
    }
  }, [initialData, courses]);

  // Fetch courses
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getCourses({});
        if (response?.status === "success") {
          setCourses(response.data);
        }
      } catch (err) {
        console.error("Error loading courses:", err);
      }
    };
    loadCourses();
  }, []);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setFile(file);
      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
      // Clear resourceAddress when uploading a file
      setFormData((prev) => ({
        ...prev,
        resourceAddress: "",
      }));
    }
  };

  const handleAdvertImageDrop = (
    acceptedFiles: File[],
    advertIndex: number
  ) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];

      setNewAdverts((prevAdverts) => {
        const updatedAdverts = [...prevAdverts];
        updatedAdverts[advertIndex] = {
          ...updatedAdverts[advertIndex],
          image: file,
        };

        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = () => {
            setNewAdverts((prevAdverts) => {
              const updatedAdverts = [...prevAdverts];
              updatedAdverts[advertIndex] = {
                ...updatedAdverts[advertIndex],
                imagePreview: reader.result as string,
              };
              return updatedAdverts;
            });
          };
          reader.readAsDataURL(file);
        }

        return updatedAdverts;
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const getAdvertDropzoneProps = (index: number) => {
    return {
      getRootProps: () => ({
        onClick: (e: React.MouseEvent) => e.stopPropagation(),
        onDragOver: (e: React.DragEvent) => e.stopPropagation(),
        onDragEnter: (e: React.DragEvent) => e.stopPropagation(),
        onDrop: (e: React.DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          const files = Array.from(e.dataTransfer.files);
          if (files.length > 0) {
            handleAdvertImageDrop([files[0]], index);
          }
        },
        className: cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          "border-blue-300 hover:border-blue-400"
        ),
      }),
      getInputProps: () => ({
        type: "file",
        accept: "image/*",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files.length > 0) {
            handleAdvertImageDrop([e.target.files[0]], index);
          }
        },
      }),
    };
  };

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

  const handleAdvertChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const { name, value } = e.target;
    setNewAdverts((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [name]: value,
      };
      return updated;
    });
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

  const handleAddNewAdvert = () => {
    if (existingAdverts.length + newAdverts.length >= MAX_FREE_ADVERTS) {
      toast.error(
        `You can only add up to ${MAX_FREE_ADVERTS} advertisements per material`
      );
      return;
    }

    setNewAdverts((prev) => [
      ...prev,
      {
        label: "",
        description: "",
        image: null,
        imagePreview: null,
      },
    ]);
  };

  const handleRemoveNewAdvert = (index: number) => {
    setNewAdverts((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const materialData: CreateMaterialDto = {
        ...formData,
        targetCourseId: selectedCourse?.id,
      };

      if (file) {
        materialData.file = file;
      }

      let materialResponse;
      if (initialData) {
        materialResponse = await updateMaterial(initialData.id, materialData);
      } else {
        materialResponse = await createMaterial(materialData);
      }

      if (materialResponse && materialResponse.status === "success") {
        const material = materialResponse.data;

        // Create adverts if checkbox is checked and there are new adverts to create
        if (includeAdvert && newAdverts.length > 0) {
          try {
            // Create all new adverts in parallel
            const advertPromises = newAdverts.map((advertData) => {
              if (!advertData.label.trim()) return null; // Skip empty adverts

              const advertPayload: CreateFreeAdvertDto = {
                label: advertData.label,
                description: advertData.description,
                materialId: material.id,
                image: advertData.image || undefined,
              };

              return createFreeAdvert(advertPayload);
            });

            await Promise.all(advertPromises.filter(Boolean));
          } catch (advertError) {
            console.error("Error creating some adverts:", advertError);
          }
        }

        onSuccess(material);
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
          {/* Title and Description */}
          <div className="gap-4 grid md:grid-cols-2">
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

            {/* Course Selection using SelectCourse component */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Target Course
              </label>
              <SelectCourse
                onChange={(courseId) => {
                  setFormData((prev) => ({
                    ...prev,
                    targetCourseId: courseId,
                  }));
                  setSelectedCourse(
                    courses.find((c) => c.id === courseId) || null
                  );
                }}
                currentValue={formData.targetCourseId}
              />
            </div>
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

          {/* Type, Visibility, and Restriction Selection */}
          <div className="gap-4 grid md:grid-cols-3">
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

          {/* File Upload Zone */}
          <div>
            <label className="block mb-1 font-medium text-gray-700 text-sm">
              Upload File or Provide URL
            </label>
            <div className="gap-4 grid md:grid-cols-2">
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="w-8 h-8 text-gray-400" />
                  {isDragActive ? (
                    <p>Drop the file here...</p>
                  ) : (
                    <>
                      <p className="text-gray-600 text-sm">
                        Drag & drop a file here, or click to select
                      </p>
                      {file && (
                        <p className="font-medium text-blue-600 text-sm">
                          Selected: {file.name}
                        </p>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div>
                <input
                  id="resourceAddress"
                  name="resourceAddress"
                  type="url"
                  value={formData.resourceAddress}
                  onChange={handleChange}
                  className="p-2 border border-gray-300 rounded-md w-full"
                  placeholder="https://example.com/resource"
                />
                <p className="mt-1 text-gray-500 text-xs">
                  You can either upload a file or provide a URL
                </p>
              </div>
            </div>

            {/* File Preview */}
            {filePreview && (
              <div className="mt-4">
                <p className="mb-2 font-medium text-gray-700 text-sm">
                  Preview:
                </p>
                <div className="relative w-32 h-32">
                  <img
                    src={filePreview}
                    alt="File preview"
                    className="rounded-lg w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setFilePreview(null);
                    }}
                    className="-top-2 -right-2 absolute bg-red-500 hover:bg-red-600 p-1 rounded-full text-white"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Tags Section */}
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

          {/* Advert Option */}
          <div className="mt-8 pt-4 border-t">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="includeAdvert"
                checked={includeAdvert || existingAdverts.length > 0}
                onChange={(e) => setIncludeAdvert(e.target.checked)}
                className="rounded w-4 h-4 text-blue-600"
              />
              <label
                htmlFor="includeAdvert"
                className="flex items-center font-medium text-gray-800"
              >
                <Megaphone className="mr-1.5 w-4 h-4 text-blue-600" />
                Advertisements for this Material
              </label>
            </div>

            {includeAdvert && (
              <div className="space-y-4 bg-blue-50 mt-2 p-4 rounded-lg animate-fadeIn">
                <h3 className="font-medium text-blue-800 text-lg">
                  Advertisement Details
                </h3>

                {/* Display existing adverts if any */}
                {existingAdverts.length > 0 && (
                  <div className="mb-6">
                    <h4 className="mb-2 font-medium text-blue-700">
                      Existing Advertisements
                    </h4>
                    <div className="space-y-4">
                      {existingAdverts.map((advert, index) => (
                        <div
                          key={advert.id}
                          className="bg-white p-4 border border-blue-200 rounded-lg"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h5 className="font-medium">{advert.label}</h5>
                              <p className="text-gray-600 text-sm">
                                {advert.description}
                              </p>
                            </div>
                            {advert.imageUrl && (
                              <div className="w-20 h-20">
                                <img
                                  src={advert.imageUrl}
                                  alt={advert.label}
                                  className="rounded-md w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 bg-amber-50 mt-3 p-2 rounded-md text-amber-600">
                      <AlertCircle className="w-4 h-4" />
                      <p className="text-sm">
                        Existing advertisements cannot be removed or modified
                      </p>
                    </div>
                  </div>
                )}

                {/* Add new adverts */}
                <div className="mt-4">
                  <h4 className="mb-2 font-medium text-blue-700">
                    {existingAdverts.length > 0
                      ? "Add New Advertisements"
                      : "Create Advertisements"}
                  </h4>

                  <div className="space-y-6">
                    {newAdverts.map((advert, index) => (
                      <div
                        key={index}
                        className="relative p-4 border border-blue-300 rounded-lg"
                      >
                        <button
                          type="button"
                          onClick={() => handleRemoveNewAdvert(index)}
                          className="-top-2 -right-2 absolute bg-red-500 hover:bg-red-600 p-1 rounded-full text-white"
                        >
                          ×
                        </button>

                        <div className="gap-4 grid md:grid-cols-2">
                          <div>
                            <label
                              htmlFor={`advert-label-${index}`}
                              className="block mb-1 font-medium text-gray-700 text-sm"
                            >
                              Ad Title *
                            </label>
                            <input
                              id={`advert-label-${index}`}
                              name="label"
                              type="text"
                              required={includeAdvert}
                              value={advert.label}
                              onChange={(e) => handleAdvertChange(e, index)}
                              className="p-2 border border-gray-300 rounded-md w-full"
                              placeholder="Enter a catchy title for your advertisement"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor={`advert-description-${index}`}
                              className="block mb-1 font-medium text-gray-700 text-sm"
                            >
                              Ad Description
                            </label>
                            <textarea
                              id={`advert-description-${index}`}
                              name="description"
                              rows={2}
                              value={advert.description}
                              onChange={(e) => handleAdvertChange(e, index)}
                              className="p-2 border border-gray-300 rounded-md w-full"
                              placeholder="Briefly describe your advertisement"
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <label
                            htmlFor={`advert-image-${index}`}
                            className="block mb-1 font-medium text-gray-700 text-sm"
                          >
                            Ad Image (Recommended)
                          </label>
                          <div
                            {...getAdvertDropzoneProps(index).getRootProps()}
                          >
                            <input
                              {...getAdvertDropzoneProps(index).getInputProps()}
                            />
                            <div className="flex flex-col items-center space-y-2">
                              <Megaphone className="w-8 h-8 text-blue-500" />
                              <p className="text-gray-600 text-sm">
                                Drag & drop an image for your ad, or click to
                                select
                              </p>
                              {advert.image && (
                                <p className="font-medium text-blue-600 text-sm">
                                  Selected: {advert.image.name}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Ad Image Preview */}
                          {advert.imagePreview && (
                            <div className="mt-3">
                              <p className="mb-1 font-medium text-gray-700 text-sm">
                                Ad Preview:
                              </p>
                              <div className="relative w-full max-w-xs">
                                <img
                                  src={advert.imagePreview}
                                  alt="Advertisement preview"
                                  className="border border-blue-200 rounded-lg w-full h-auto object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setNewAdverts((prev) => {
                                      const updated = [...prev];
                                      updated[index] = {
                                        ...updated[index],
                                        image: null,
                                        imagePreview: null,
                                      };
                                      return updated;
                                    });
                                  }}
                                  className="-top-2 -right-2 absolute bg-red-500 hover:bg-red-600 p-1 rounded-full text-white"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddNewAdvert}
                      disabled={
                        existingAdverts.length + newAdverts.length >=
                        MAX_FREE_ADVERTS
                      }
                      className={cn(
                        "flex items-center gap-2 border-dashed border-blue-500 text-blue-600",
                        existingAdverts.length + newAdverts.length >=
                          MAX_FREE_ADVERTS && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <PlusCircle className="w-4 h-4" />
                      Add Another Advertisement
                    </Button>

                    <div className="flex items-center gap-2 bg-blue-50 mt-3 p-2 rounded-md text-blue-600">
                      <AlertCircle className="w-4 h-4" />
                      <p className="text-sm">
                        You can add up to {MAX_FREE_ADVERTS} advertisements per
                        material ({existingAdverts.length + newAdverts.length}/
                        {MAX_FREE_ADVERTS} used)
                      </p>
                    </div>

                    <p className="mt-3 text-blue-600 text-xs">
                      Your advertisements will be shown to users browsing
                      materials, helping to promote your content and increase
                      visibility.
                    </p>
                  </div>
                </div>
              </div>
            )}
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
