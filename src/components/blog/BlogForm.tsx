"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { createBlog } from "../../api/blog.api";
import { useDropzone } from "react-dropzone";
import Editor from "./quill";
import { Plus, X } from "lucide-react";
import { Blog } from "@/lib/types/response.type";
import { editBlog } from "@/api/blog.api";

type dataProp = {
  data?: Blog;
};

const PostForm = ({ data }: dataProp) => {
  const [formData, setFormData] = useState({
    title: data?.title || "",
    description: data?.description || "",
    category: data?.type || "",
    tags: data?.tags || [],
  });
  console.log(data?.type);

  const [editorContent, setEditorContent] = useState(data?.body || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    data?.headingImageAddress || null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // const router = useRouter();
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || "",
        description: data.description || "",
        category: data.type.toLowerCase() || "",
        tags: data.tags || [],
      });
      setEditorContent(data.body || "");
      setImagePreview(data.headingImageAddress || null);
    }
  }, [data]);

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
      formDataToSend.append("type", formData.category);
      formDataToSend.append("body", editorContent);
      formData.tags.forEach((tag) => formDataToSend.append("tags", tag));

      if (imageFile) {
        formDataToSend.append("headingImage", imageFile);
      }

      let response;

      if (data) {
        response = await editBlog(formDataToSend, data.id);
      } else {
        response = await createBlog(formDataToSend);
      }

      console.log();

      // @ts-ignore
      router.push("/dashboard/blogs");
      // Refresh the page after navigation
      router.refresh();
      toast.success("Blog Submitted successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit blog");
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
    <div className="mx-auto w-full max-w-7xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Cover Image Section */}
        <div className="w-full">
          <label className="block mb-2 font-medium text-gray-700 text-lg">
            Blog Cover Image:
          </label>
          <div className="gap-8 grid grid-cols-1 md:grid-cols-2">
            <div
              {...getRootProps()}
              className={`w-full p-4 border-2 border-dashed rounded-lg ${
                isDragActive
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-300"
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="flex justify-center items-center h-[120px] text-indigo-500 text-center">
                  Drop the image here...
                </p>
              ) : (
                <p className="flex justify-center items-center h-[120px] text-gray-500 text-center">
                  Drag & drop an image here, or click to select one
                </p>
              )}
            </div>
            {imagePreview && (
              <div className="flex justify-center items-center">
                <img
                  src={imagePreview}
                  alt="Blog Cover Preview"
                  className="shadow-md rounded-lg max-h-[120px] object-contain"
                />
              </div>
            )}
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-lg">
              Title:
            </label>
            <input
              required
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003666] w-full text-lg"
              placeholder="Enter your post title"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 text-lg">
              Description:
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003666] w-full h-24 text-lg resize-none"
              placeholder="Enter a short description"
            />
          </div>
        </div>

        {/* Editor Section */}
        <div className="w-full">
          <label className="block mb-2 font-medium text-gray-700 text-lg">
            Content:
          </label>
          <div className="w-full">
            <Editor
              onContentChange={(content) => setEditorContent(content)}
              value={editorContent}
            />
          </div>
        </div>

        {/* Category and Tags */}
        <div className="gap-8 grid grid-cols-1 md:grid-cols-2 pt-6 border-gray-200 border-t">
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-lg">
              Category:
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003666] w-full text-lg"
            >
              <option value="">Select Category</option>
              <option value="article">Article</option>
              <option value="scheme_of_work">Scheme of Work</option>
              <option value="guideline">Guideline</option>
              <option value="tutorial">Tutorial</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium text-gray-700 text-lg">
              Tags:
            </label>
            <div className="flex">
              <input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Add tag and press Enter"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003666] w-full text-lg"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-gray-200 hover:bg-gray-300 ml-2 px-4 py-3 rounded-lg transition"
              >
                <Plus size={20} />
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-1 bg-blue-100 px-3 py-1.5 rounded-full text-blue-800 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-gray-200 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#003666] hover:bg-blue-900 shadow-md px-8 py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003666] w-full md:w-auto font-medium text-white text-lg transition-all duration-300 ease-in-out"
          >
            {isSubmitting
              ? "Submitting..."
              : data
              ? "Update Blog"
              : "Create Blog"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
