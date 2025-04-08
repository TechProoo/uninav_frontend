"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import createBlog from "../../api/blog";
import { useDropzone } from "react-dropzone";
import Editor from "./quill";
import { Plus, X } from "lucide-react";

const PostForm = () => {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: string;
    tags: string[];
  }>({
    title: "",
    description: "",
    category: "",
    tags: [],
  });
  const [editorContent, setEditorContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !editorContent || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("tags", formData.tags.join(", "));
      formDataToSend.append("body", editorContent);

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const response = await createBlog(formDataToSend);

      if (response) {
        console.log(response);
        setFormData({
          title: "",
          description: "",
          category: "",
          tags: [],
        });
        setEditorContent("");
        setImageFile(null);
        setImagePreview(null);
        router.push("/dashboard");
        toast.success("Post created successfully");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles[0]) {
      const file = acceptedFiles[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  // Tag functions
  const addTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setTagInput("");
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex justify-around flex-wrap gap-8"
      >
        <div className="space-y-6 w-full md:w-1/2">
          {/* Title */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Title:
            </label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003666] focus:outline-none"
              placeholder="Enter your post title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Description:
            </label>
            <input
              required
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003666] focus:outline-none"
              placeholder="Enter a short description"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Image:
            </label>
            <div
              {...getRootProps()}
              className={`w-full p-4 border-2 border-dashed rounded-lg ${
                isDragActive
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300"
              }`}
            >
              <input required {...getInputProps()} />
              {isDragActive ? (
                <p className="text-center text-indigo-500 h-[200px]">
                  Drop the image here...
                </p>
              ) : (
                <p className="text-center text-gray-500 h-[200px]">
                  Drag & drop an image here, or click to select one
                </p>
              )}
            </div>
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              </div>
            )}
          </div>

          {/* Body (Content) */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Body:
            </label>
            <Editor onContentChange={(content) => setEditorContent(content)} />
          </div>
        </div>

        <div className="space-y-6 w-full md:w-1/3">
          {/* Category */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Category:
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003666] focus:outline-none"
            >
              <option value="">Select Category</option>
              <option value="tech">Tech</option>
              <option value="lifestyle">Lifestyle</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Tags:
            </label>
            <div className="flex">
              <input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tag and press Enter"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003666] focus:outline-none"
              />
              <button
                type="button"
                onClick={addTag}
                className="ml-2 px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                <Plus size={16} />
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-white bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-[#003666] focus:outline-none"
          >
            {isSubmitting ? "Submitting..." : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
