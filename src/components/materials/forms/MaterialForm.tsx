"use client";
import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Upload, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Material,
  MaterialTypeEnum,
  VisibilityEnum,
  RestrictionEnum,
  Course,
} from "@/lib/types/response.type";
import {
  CreateMaterialDto,
  createMaterial,
  updateMaterial,
} from "@/api/material.api";
import { CreateFreeAdvertDto, createFreeAdvert } from "@/api/advert.api";
import { getCourses } from "@/api/course.api";
import { useDropzone } from "react-dropzone";

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

  const [formData, setFormData] = useState<CreateMaterialDto>({
    label: "",
    description: "",
    type: MaterialTypeEnum.PDF,
    tags: [],
    visibility: VisibilityEnum.PUBLIC,
    restriction: RestrictionEnum.DOWNLOADABLE,
    resourceAddress: "",
  });

  const [advertData, setAdvertData] = useState<CreateFreeAdvertDto>({
    label: "",
    description: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [advertImage, setAdvertImage] = useState<File | null>(null);
  const [advertImagePreview, setAdvertImagePreview] = useState<string | null>(
    null
  );
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
        targetCourse: initialData.targetCourseId || undefined,
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
          level: 0,
        };
        setSelectedCourse(course);
      }
    }
  }, [initialData, courses]);

  // Fetch courses
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const response = await getCourses({ limit: 100 });
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

  const onAdvertImageDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setAdvertImage(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setAdvertImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const {
    getRootProps: getAdvertRootProps,
    getInputProps: getAdvertInputProps,
    isDragActive: isAdvertDragActive,
  } = useDropzone({
    onDrop: onAdvertImageDrop,
    multiple: false,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
  });

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAdvertData((prev) => ({
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

  const handleAdvertImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setAdvertImage(file);

      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = () => {
          setAdvertImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
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
        targetCourse: selectedCourse?.id,
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

        // Create advert if checkbox is checked
        if (includeAdvert) {
          try {
            const advertPayload: CreateFreeAdvertDto = {
              ...advertData,
              materialId: material.id,
              image: advertImage || undefined,
            };

            const advertResponse = await createFreeAdvert(advertPayload);
            if (!advertResponse || advertResponse.status !== "success") {
              console.error("Failed to create advert, but material was saved");
            }
          } catch (advertError) {
            console.error("Error creating advert:", advertError);
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

            {/* Course Selection Combobox */}
            <div>
              <label className="block mb-1 font-medium text-gray-700 text-sm">
                Target Course
              </label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between w-full"
                  >
                    {selectedCourse
                      ? selectedCourse.courseCode
                      : "Select course..."}
                    <ChevronsUpDown className="opacity-50 ml-2 w-4 h-4 shrink-0" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-full">
                  <Command>
                    <CommandInput placeholder="Search courses..." />
                    <CommandEmpty>No course found.</CommandEmpty>
                    <CommandGroup className="max-h-60 overflow-y-auto">
                      {courses.map((course) => (
                        <CommandItem
                          key={course.id}
                          value={course.courseCode}
                          onSelect={() => {
                            setSelectedCourse(course);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedCourse?.id === course.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {course.courseCode} - {course.courseName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
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
                checked={includeAdvert}
                onChange={(e) => setIncludeAdvert(e.target.checked)}
                className="rounded w-4 h-4 text-blue-600"
              />
              <label
                htmlFor="includeAdvert"
                className="flex items-center font-medium text-gray-800"
              >
                <Megaphone className="mr-1.5 w-4 h-4 text-blue-600" />
                Add Free Advertisement for this Material
              </label>
            </div>

            {includeAdvert && (
              <div className="space-y-4 bg-blue-50 mt-2 p-4 rounded-lg animate-fadeIn">
                <h3 className="font-medium text-blue-800 text-lg">
                  Advertisement Details
                </h3>

                <div className="gap-4 grid md:grid-cols-1">
                  <div>
                    <label
                      htmlFor="advert-label"
                      className="block mb-1 font-medium text-gray-700 text-sm"
                    >
                      Ad Title *
                    </label>
                    <input
                      id="advert-label"
                      name="label"
                      type="text"
                      required={includeAdvert}
                      value={advertData.label}
                      onChange={handleAdvertChange}
                      className="p-2 border border-gray-300 rounded-md w-full"
                      placeholder="Enter a catchy title for your advertisement"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="advert-description"
                      className="block mb-1 font-medium text-gray-700 text-sm"
                    >
                      Ad Description
                    </label>
                    <textarea
                      id="advert-description"
                      name="description"
                      rows={2}
                      value={advertData.description}
                      onChange={handleAdvertChange}
                      className="p-2 border border-gray-300 rounded-md w-full"
                      placeholder="Briefly describe your advertisement"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="advert-image"
                      className="block mb-1 font-medium text-gray-700 text-sm"
                    >
                      Ad Image (Recommended)
                    </label>
                    <div
                      {...getAdvertRootProps()}
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                        isAdvertDragActive
                          ? "border-blue-500 bg-blue-100"
                          : "border-blue-300 hover:border-blue-400"
                      )}
                    >
                      <input {...getAdvertInputProps()} />
                      <div className="flex flex-col items-center space-y-2">
                        <Megaphone className="w-8 h-8 text-blue-500" />
                        {isAdvertDragActive ? (
                          <p>Drop the image here...</p>
                        ) : (
                          <>
                            <p className="text-gray-600 text-sm">
                              Drag & drop an image for your ad, or click to
                              select
                            </p>
                            {advertImage && (
                              <p className="font-medium text-blue-600 text-sm">
                                Selected: {advertImage.name}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Ad Image Preview */}
                    {advertImagePreview && (
                      <div className="mt-3">
                        <p className="mb-1 font-medium text-gray-700 text-sm">
                          Ad Preview:
                        </p>
                        <div className="relative w-full max-w-xs">
                          <img
                            src={advertImagePreview}
                            alt="Advertisement preview"
                            className="border border-blue-200 rounded-lg w-full h-auto object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setAdvertImage(null);
                              setAdvertImagePreview(null);
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
                <p className="text-blue-600 text-xs">
                  Your advertisement will be shown to users browsing materials,
                  helping to promote your content and increase visibility.
                </p>
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
