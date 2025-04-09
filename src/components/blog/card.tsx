"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowBigRight, Edit, Trash } from "lucide-react";
import { Content } from "@/lib/types/response.type";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import deleteBlog from "@/api/deleteBlog.api";
import Link from "next/link";

type DataContent = {
  data: Content;
  onDelete?: (id: string) => void;
};

const Card = ({ data, onDelete }: DataContent) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  if (!data) return null;

  console.log(data);

  const handleEdit = () => {
    router.push(`/dashboard/blogs/editblog?id=${data.id}`);
  };

  const handleDeletePost = async (postId: string) => {
    setDeleting(true);
    try {
      await deleteBlog(postId);
    onDelete?.(postId);
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
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-sm  rounded-[24px] p-4 relative">
      <div className="relative overflow-hidden rounded-[24px]">
        <Image
          src={data.headingImageAddress || "/fallback.jpg"}
          alt="Blog Image"
          width={400}
          height={200}
          className="w-full h-48 object-cover rounded-[24px] rounded-br-[0px]"
        />
        <div className="absolute flex items-center top-0 right-5">
          <div
            className="bg-[#f0f8ff] p-1 rounded-bl-lg rounded-br-lg cursor-pointer active:animate-shake"
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
            className="bg-[#f0f8ff] p-2 rounded-bl-lg rounded-br-lg cursor-pointer active:animate-shake"
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
          <span className="text-white text-xl mt-2 group-hover:translate-x-2 transition-transform duration-300">
            <ArrowBigRight size={30} className="text-[#0c385f]" />
          </span>
        </Link>
      </div>
      <h2 className="mt-4 text-xl font-semibold text-gray-900 line-clamp-2">
        {data.title}
      </h2>
      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
        {data.description}
      </p>
      <div className="flex gap-2 mt-4">
        <span className="text-xs font-medium bg-orange-200 text-orange-800 px-3 py-1 rounded-full">
          {new Date(data.createdAt).toLocaleDateString()}
        </span>
        <span className="text-xs font-medium bg-green-200 text-green-800 px-3 py-1 rounded-full">
          {data.creator?.username || "Anonymous"}
        </span>
      </div>
    </div>
  );
};

export default Card;
