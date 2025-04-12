"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  ArrowBigRight,
  CalendarIcon,
  MessageCircle,
  ThumbsUp,
  Eye,
  Tag,
  BookText,
  User,
  Clock,
} from "lucide-react";
import { Blog, BlogType } from "@/lib/types/response.type";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBlogTypeDisplay = (type: BlogType) => {
    const typeMap: Record<BlogType, { label: string; color: string }> = {
      [BlogType.ARTICLE]: {
        label: "Article",
        color: "bg-blue-100 text-blue-800",
      },
      [BlogType.SCHEME_OF_WORK]: {
        label: "Scheme of Work",
        color: "bg-purple-100 text-purple-800",
      },
      [BlogType.GUIDELINE]: {
        label: "Guideline",
        color: "bg-green-100 text-green-800",
      },
      [BlogType.TUTORIAL]: {
        label: "Tutorial",
        color: "bg-amber-100 text-amber-800",
      },
    };

    return (
      typeMap[type] || { label: "Blog", color: "bg-gray-100 text-gray-800" }
    );
  };

  if (viewMode === "list") {
    const blogTypeInfo = getBlogTypeDisplay(data.type);

    return (
      <div className="bg-white shadow-md hover:shadow-lg mx-2 my-3 p-4 rounded-xl transition-shadow">
        <div className="flex md:flex-row flex-col gap-4">
          <div className="md:w-1/4">
            <div className="relative rounded-lg overflow-hidden">
              <Image
                src={data.headingImageAddress || "/fallback.jpg"}
                alt="Blog Image"
                width={300}
                height={200}
                className="rounded-lg w-full h-48 md:h-40 object-cover"
              />
              <Badge
                className={cn(
                  "absolute bottom-2 left-2 rounded-md",
                  blogTypeInfo.color
                )}
              >
                <BookText className="mr-1 w-3 h-3" /> {blogTypeInfo.label}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col justify-between md:w-3/4">
            <div>
              <h2 className="font-semibold text-gray-900 text-xl">
                {data.title}
              </h2>

              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <div className="flex items-center text-gray-500 text-sm">
                  <User className="mr-1 w-3 h-3" />
                  {data.creator?.username || "Anonymous"}
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center text-gray-500 text-sm">
                  <CalendarIcon className="mr-1 w-3 h-3" />
                  {formatDate(data.createdAt)}
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="mr-1 w-3 h-3" />
                  {formatTime(data.createdAt)}
                </div>
              </div>

              <div className="flex items-center gap-4 mt-2 text-gray-500 text-xs">
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {data.views} views
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  {data.likes} likes
                </div>
              </div>

              <p className="mt-2 text-gray-600 text-sm line-clamp-3">
                {data.description}
              </p>

              {data.tags && data.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {data.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1 bg-white border-gray-300 rounded-md"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view with minor improvements
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
          href={`/blog/${data.id}`}
          className="group right-10 bottom-10 absolute flex justify-center items-center bg-[#f0f8ff] rounded-tl-full w-20 h-20 transition-colors translate-x-1/2 translate-y-1/2 duration-300 cursor-pointer"
        >
          <span className="mt-2 text-white text-xl transition-transform group-hover:translate-x-2 duration-300">
            <ArrowBigRight size={30} className="text-[#0c385f]" />
          </span>
        </Link>

        {/* Added blog type badge */}
        {data.type && (
          <Badge
            className={cn(
              "absolute top-2 left-2 rounded-md",
              getBlogTypeDisplay(data.type).color
            )}
          >
            <BookText className="mr-1 w-3 h-3" />{" "}
            {getBlogTypeDisplay(data.type).label}
          </Badge>
        )}
      </div>

      <h2 className="mt-4 font-semibold text-gray-900 text-xl line-clamp-2">
        {data.title}
      </h2>
      <p className="mt-1 text-gray-500 text-sm line-clamp-2">
        {data.description}
      </p>

      <div className="flex flex-wrap gap-4 mt-3">
        <span className="flex items-center gap-1 bg-orange-200 px-3 py-1 rounded-full font-medium text-orange-800 text-xs">
          <CalendarIcon className="w-3 h-3" /> {formatDate(data.createdAt)}
        </span>
        <span className="flex items-center gap-1 bg-green-200 px-3 py-1 rounded-full font-medium text-green-800 text-xs">
          <User className="w-3 h-3" /> {data.creator?.username || "Anonymous"}
        </span>

        {/* Added view and like counts */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <Eye className="w-3 h-3" /> {data.views}
          </div>
          <div className="flex items-center gap-1 text-gray-500 text-xs">
            <ThumbsUp className="w-3 h-3" /> {data.likes}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
