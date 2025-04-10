"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import createBlog from "../../api/blog.api";
import { useDropzone } from "react-dropzone";
import Editor from "./quill";
import { Plus, X } from "lucide-react";
import { Blog } from "@/lib/types/response.type";
import { editBlog } from "@/api/editBlog.api";

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

      console.log(response);

      if (response) {
        // @ts-ignore
        router.push("/dashboard/blogs").then(() => {
          // Refresh the page after navigation
          router.refresh();
        });
        toast.success("Post submitted successfully");
      } else {
        toast.error("Failed to submit post");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to submit post");
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
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-wrap justify-around gap-8"
      >
        <div className="space-y-6 w-full md:w-1/2">
          {/* Title */}
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
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003666] w-full"
              placeholder="Enter your post title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-lg">
              Description:
            </label>
            <input
              required
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003666] w-full"
              placeholder="Enter a short description"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-lg">
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
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="h-[200px] text-indigo-500 text-center">
                  Drop the image here...
                </p>
              ) : (
                <p className="h-[200px] text-gray-500 text-center">
                  Drag & drop an image here, or click to select one
                </p>
              )}
            </div>
            {imagePreview && (
              <div className="mt-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="shadow-md rounded-lg w-full h-auto"
                />
              </div>
            )}
          </div>

          {/* Body (Content) */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-lg">
              Body:
            </label>
            <Editor
              onContentChange={(content) => setEditorContent(content)}
              value={editorContent}
            />
          </div>
        </div>

        <div className="space-y-6 w-full md:w-1/3">
          {/* Category (type) */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 text-lg">
              Category:
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003666] w-full"
            >
              <option value="">Select Category</option>
              <option value="article">Article</option>
              <option value="scheme_of_work">Scheme_of_Work</option>
              <option value="guideline">Guideline</option>
              <option value="tutorial">Tutorial</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block mb-2 font-medium text-gray-700 text-lg"
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
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003666] w-full"
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-gray-200 hover:bg-gray-300 ml-2 px-3 py-2 rounded-lg transition"
              >
                <Plus size={16} />
              </button>
            </div>

            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-1 bg-blue-100 px-3 py-1 rounded-full text-blue-800 text-sm"
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
            className="bg-[#003666] hover:bg-blue-500 transition-all duration-300 ease-in-out shadow-md py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#003666] w-full text-white"
          >
            {isSubmitting
              ? "Submitting..."
              : data
              ? "Update Post"
              : "Create Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
