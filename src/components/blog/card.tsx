"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowBigRight, Edit, Trash } from "lucide-react";
import { Blog } from "@/lib/types/response.type";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteBlog } from "@/api/blog.api";
import Link from "next/link";

type DataContent = {
  data: Blog;
  onDelete?: (id: string) => void;
  onEditSuccess?: () => void;
};

const Card = ({ data, onDelete, onEditSuccess }: DataContent) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  if (!data) return null;

  const handleEdit = () => {
    router.push(`/dashboard/blogs/editblog?id=${data.id}`);
    // If you're editing inline or in a modal, trigger refetch after success:
    onEditSuccess?.();
  };

  const handleDeletePost = async (postId: string) => {
    setDeleting(true);
    try {
      await deleteBlog(postId);
      onDelete?.(postId); // Triggers refetch from parent
      router.refresh();
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Failed to delete post", error);
      toast.error("Failed to delete post");
    } finally {
      setDeleting(false);
    }
  };

  if (deleting) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-10 h-10 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative p-4 rounded-[24px] max-w-sm">
      <div className="relative rounded-[24px] overflow-hidden">
        <Image
          src={data.headingImageAddress || "/fallback.jpg"}
          alt="Blog Image"
          width={400}
          height={200}
          className="rounded-[24px] rounded-br-[0px] w-full h-48 object-cover"
        />
        <div className="top-0 right-5 absolute flex items-center">
          <div
            className="bg-[#f0f8ff] p-1 rounded-bl-lg rounded-br-lg active:animate-shake cursor-pointer"
            onClick={(e) => {
              e.currentTarget.classList.add("animate-shake");
              handleEdit();
            }}
            onAnimationEnd={(e) =>
              e.currentTarget.classList.remove("animate-shake")
            }
          >
            <Edit size={15} color="#003666" />
          </div>
          <div
            className="bg-[#f0f8ff] p-2 rounded-bl-lg rounded-br-lg active:animate-shake cursor-pointer"
            onClick={(e) => e.currentTarget.classList.add("animate-shake")}
            onAnimationEnd={(e) =>
              e.currentTarget.classList.remove("animate-shake")
            }
          >
            <Trash
              size={15}
              onClick={() => handleDeletePost(data.id)}
              className="text-red-500"
            />
          </div>
        </div>
        <Link
          href={`/dashboard/blogs/viewblog?id=${data.id}`}
          className="absolute bottom-10 right-10 w-20 h-20 bg-[#f0f8ff] rounded-tl-full flex items-center justify-center translate-x-1/2 translate-y-1/2 group transition-colors duration-300 cursor-pointer"
        >
          <span className="mt-2 text-white text-xl transition-transform group-hover:translate-x-2 duration-300">
            <ArrowBigRight size={30} className="text-[#0c385f]" />
          </span>
        </Link>
      </div>
      <h2 className="mt-4 font-semibold text-gray-900 text-xl line-clamp-2">
        {data.title}
      </h2>
      <p className="mt-1 text-gray-500 text-sm line-clamp-2">
        {data.description}
      </p>
      <div className="flex gap-2 mt-4">
        <span className="bg-orange-200 px-3 py-1 rounded-full font-medium text-orange-800 text-xs">
          {new Date(data.createdAt).toLocaleDateString()}
        </span>
        <span className="bg-green-200 px-3 py-1 rounded-full font-medium text-green-800 text-xs">
          {data.creator?.username || "Anonymous"}
        </span>
      </div>
    </div>
  );
};

export default Card;
