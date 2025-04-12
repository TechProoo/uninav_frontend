"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ArrowBigRight } from "lucide-react";
import { Blog } from "@/lib/types/response.type";
import Link from "next/link";

type BlogCardProps = {
  data: Blog;
  viewMode?: "grid" | "list";
};

const BlogCard = ({ data, viewMode = "grid" }: BlogCardProps) => {
  const [deleting, setDeleting] = useState(false);

  if (!data) return null;

  if (deleting) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-10 h-10 animate-spin"></div>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className="bg-white shadow-sm hover:shadow-md p-4 rounded-xl transition-shadow">
        <div className="flex md:flex-row flex-col gap-4">
          <div className="md:w-1/4">
            <div className="relative rounded-lg overflow-hidden">
              <Image
                src={data.headingImageAddress || "/fallback.jpg"}
                alt="Blog Image"
                width={300}
                height={200}
                className="rounded-lg w-full h-48 md:h-32 object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col justify-between md:w-3/4">
            <div>
              <h2 className="font-semibold text-gray-900 text-xl line-clamp-1">
                {data.title}
              </h2>
              <p className="mt-1 text-gray-500 text-sm line-clamp-3">
                {data.description}
              </p>
            </div>
            <div className="flex justify-between items-end mt-3">
              <div className="flex gap-2">
                <span className="bg-orange-200 px-3 py-1 rounded-full font-medium text-orange-800 text-xs">
                  {new Date(data.createdAt).toLocaleDateString()}
                </span>
                <span className="bg-green-200 px-3 py-1 rounded-full font-medium text-green-800 text-xs">
                  {data.creator?.username || "Anonymous"}
                </span>
              </div>
              <Link
                href={`/blogs/${data.id}`}
                className="flex justify-center items-center bg-blue-50 hover:bg-blue-100 p-2 rounded-lg transition-colors"
              >
                <ArrowBigRight size={20} className="text-blue-800" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-white shadow-sm hover:shadow-md p-4 rounded-[24px] transition-shadow">
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
