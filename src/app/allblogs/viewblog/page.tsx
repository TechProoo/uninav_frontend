"use client";
import getBlogById from "@/api/blogById.api";
import { Blog } from "@/lib/types/response.type";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Eye } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
    queryFn: async () => {
      if (!id) throw new Error("Blog ID is required");
      const data = await getBlogById(id);
      if (!data) throw new Error("Blog not found");
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="border-t-2 border-b-2 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );

  if (error || !blogs)
    return (
      <div className="flex flex-col justify-center items-center gap-4 min-h-[60vh]">
        <div className="font-semibold text-red-600 text-center">
          {error instanceof Error ? error.message : "Failed to load blog"}
        </div>
        <button
          onClick={() => router.back()}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white transition"
        >
          Go Back
        </button>
      </div>
    );

  const router = useRouter();

  return (
    <div>
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-gray-700 hover:text-indigo-600 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        Back
      </button>
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
            <div className="shadow-lg overflow-hidden news_content_img">
              <Image
                src={blogs.headingImageAddress}
                alt="News Title"
                className="w-full h-auto object-cover"
                width={600}
                height={500}
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

        <article className="space-y-6 w-full text-lg leading-relaxed">
          <div
            className="ql-editor"
            dangerouslySetInnerHTML={{
              __html: draftToHtml(JSON.parse(blogs.body)), // Convert from JSON string to object
            }}
          />
        </article>

        <div className="flex items-center gap-3 mt-5">
          <div className="flex items-center gap-3 fnth">
            <p>Tags:</p>
            <div className="flex gap-2">
              {blogs.tags &&
                blogs.tags?.map((tg) => (
                  <span key={tg} className="bg-slate-200 px-3 py-2 rounded-lg">
                    {tg}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
