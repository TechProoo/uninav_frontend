"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowBigRight, Edit, Trash } from "lucide-react";
import { Blog } from "@/lib/types/response.type";
import { useRouter } from "next/navigation";
import Link from "next/link";

type DataContent = {
  data: Blog;
};

const BlogCard = ({ data }: DataContent) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  if (!data) return null;

  console.log(data);

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
        <Link
          href={`/blogs/${data.id}`}
          className="group right-10 bottom-10 absolute flex justify-center items-center bg-[#f0f8ff] rounded-tl-full w-20 h-20 transition-colors translate-x-1/2 translate-y-1/2 duration-300 cursor-pointer"
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

export default BlogCard;
