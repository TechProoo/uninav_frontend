"use client";
import getBlogById from "@/api/blogById.api";
import { Content } from "@/lib/types/response.type";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Eye } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import draftToHtml from "draftjs-to-html";

const page = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const {
    data: blogs,
    isLoading,
    error,
  } = useQuery<Content>({
    queryKey: ["blogsId", id],
    queryFn: () => (id ? getBlogById(id) : Promise.reject("Invalid blog ID")),
    enabled: !!id,
  });

  //   const htmlBody = useMemo(() => {
  //     return blogs ? draftToHtml(blogs.body) : "";
  //   }, [blogs]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error || !blogs)
    return (
      <div className="text-center text-red-600 font-semibold mt-10">
        Failed to load blog.
      </div>
    );

  return (
    <div>
      <div className="news_content_cover">
        <div className="grid grid-cols-12 items-center gap-4">
          <div className="col-span-12 md:col-span-5 text-left md:text-right px-6">
            <span className="inline-block bg-red-700 text-white rounded-xl px-3 py-1 text-sm font-bold">
              {blogs.type}
            </span>
            <h1 className="text-4xl font-bold fnt text-white mt-4 leading-tight">
              {blogs.title}
            </h1>
            <div className="mt-4 text-gray-400 text-sm">
              <b>
                Author -{" "}
                <span className="text-white font-semibold">
                  {blogs.creator.username}
                </span>
              </b>
            </div>
            <div className="hero_icons mt-4 flex items-center justify-start gap-1 md:justify-end text-gray-300 text-sm">
              <Eye size={15} className="text-gray-500" />
              <b className="text-sm">{blogs.views}</b>
            </div>

            <div className="mt-4 flex items-center justify-start md:justify-end text-gray-300 text-sm">
              <Calendar size={14} className="mr-2" />
              <span>{new Date(blogs.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7">
            <div className="news_content_img rounded-lg overflow-hidden shadow-lg">
              <Image
                src={blogs.headingImageAddress}
                alt="News Title"
                className="w-full h-auto object-cover"
                width={600}
                height={400}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="news_content w-11/12 md:w-11/12 lg:w-10/12 mx-auto my-12 text-gray-800">
        <div className="text-center mx-auto mb-10">
          <blockquote className="italic text-lg text-gray-600 border-l-4 border-gray-400 pl-4">
            {blogs.description}
          </blockquote>
        </div>

        <article className="leading-relaxed text-lg space-y-6">
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{
              __html: draftToHtml(JSON.parse(blogs.body)), // Convert from JSON string to object
            }}
          />
        </article>

        <div className="mt-5 flex gap-3 items-center">
          <span className="fnth">Tags: {blogs.tags}</span>
        </div>
      </div>
    </div>
  );
};

export default page;
