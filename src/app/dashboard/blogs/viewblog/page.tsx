"use client";
import getBlogById from "@/api/blogById.api";
import { Blog } from "@/lib/types/response.type";
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
  } = useQuery<Blog>({
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
        <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-10 h-10 animate-spin"></div>
      </div>
    );

  if (error || !blogs)
    return (
      <div className="mt-10 font-semibold text-red-600 text-center">
        Failed to load blog.
      </div>
    );

  return (
    <div>
      <div className="news_content_cover">
        <div className="items-center gap-4 grid grid-cols-12">
          <div className="col-span-12 md:col-span-5 px-6 text-left md:text-right">
            <span className="inline-block bg-red-700 px-3 py-1 rounded-xl font-bold text-white text-sm">
              {blogs.type}
            </span>
            <h1 className="mt-4 font-bold text-white text-4xl leading-tight fnt">
              {blogs.title}
            </h1>
            <div className="mt-4 text-gray-400 text-sm">
              <b>
                Author -{" "}
                <span className="font-semibold text-white">
                  {blogs.creator.username}
                </span>
              </b>
            </div>
            <div className="flex justify-start md:justify-end items-center gap-1 mt-4 text-gray-300 text-sm hero_icons">
              <Eye size={15} className="text-gray-500" />
              <b className="text-sm">{blogs.views}</b>
            </div>

            <div className="flex justify-start md:justify-end items-center mt-4 text-gray-300 text-sm">
              <Calendar size={14} className="mr-2" />
              <span>{new Date(blogs.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7">
            <div className="shadow-lg rounded-lg overflow-hidden news_content_img">
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

      <div className="mx-auto my-12 w-11/12 md:w-11/12 lg:w-10/12 text-gray-800 news_content">
        <div className="mx-auto mb-10 text-center">
          <blockquote className="pl-4 border-gray-400 border-l-4 text-gray-600 text-lg italic">
            {blogs.description}
          </blockquote>
        </div>

        <article className="space-y-6 text-lg leading-relaxed">
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{
              __html: draftToHtml(JSON.parse(blogs.body)), // Convert from JSON string to object
            }}
          />
        </article>

        <div className="mt-5 flex gap-3 items-center">
          <div className="fnth flex gap-3 items-center">
            {blogs.tags && (
              <>
                <p>Tags:</p>
                <div className="flex gap-2">
                  {blogs.tags.map((tg) => (
                    <span className="bg-slate-200 rounded-lg px-3 py-2">
                      {tg}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
