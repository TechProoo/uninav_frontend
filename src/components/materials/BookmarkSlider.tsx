"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Bookmark, Material } from "@/lib/types/response.type";
import { formatDistanceToNow } from "date-fns";
import { Book } from "lucide-react";
import { getMaterialById } from "@/api/material.api";
import MaterialDetail from "./MaterialDetail";
import { ArrowLeft } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface BookmarkSliderProps {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string | null;
}

const BookmarkSlider: React.FC<BookmarkSliderProps> = ({
  bookmarks,
  loading,
  error,
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );

  const handleBookmarkClick = async (bookmark: Bookmark) => {
    if (!bookmark.material?.id) return;

    try {
      const response = await getMaterialById(bookmark.material.id);
      if (response?.status === "success") {
        setSelectedMaterial(response.data);
      }
    } catch (error) {
      console.error("Error fetching material details:", error);
    }
  };

  if (loading) {
    return (
      <div className="my-6 p-4">
        <div className="flex justify-center">
          <div className="border-b-2 border-blue-700 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-6 p-4">
        <div className="bg-red-100 px-4 py-3 border border-red-400 rounded text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="bg-gray-50 shadow-sm my-6 p-4 rounded-lg">
        <div className="p-6 text-center">
          <h3 className="font-medium text-gray-700 text-lg">
            No bookmarks yet
          </h3>
          <p className="mt-2 text-gray-500">
            Bookmark materials to access them quickly from here.
          </p>
        </div>
      </div>
    );
  }

  if (selectedMaterial) {
    return (
      <div className="my-6">
        <div className="mb-4">
          <button
            onClick={() => setSelectedMaterial(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Bookmarks
          </button>
        </div>
        <MaterialDetail material={selectedMaterial} isOwner={false} />
      </div>
    );
  }

  return (
    <div className="my-6">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
        className="bookmark-swiper"
      >
        {bookmarks.map((bookmark) => (
          <SwiperSlide key={bookmark.id}>
            <div
              className="group relative flex flex-col bg-white shadow-md hover:shadow-lg border border-slate-100 rounded-2xl w-full overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              onClick={() => handleBookmarkClick(bookmark)}
            >
              {/* Card Top Accent */}
              <div className="top-0 left-0 absolute bg-gradient-to-r from-[#003666] to-[#75BFFF] w-full h-1.5" />

              {/* Material Image/Icon Area */}
              <div className="relative flex justify-center items-center bg-gradient-to-br from-slate-50 to-slate-100 w-full h-44 md:h-36 overflow-hidden">
                {bookmark.material?.resource?.resourceAddress ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-all duration-300"
                    style={{
                      backgroundImage: `url(${bookmark.material.resource.resourceAddress})`,
                    }}
                  />
                ) : (
                  <div className="z-10 relative flex justify-center items-center bg-gradient-to-br from-[#003666] to-[#75BFFF] p-0.5 rounded-full w-16 h-16">
                    <div className="flex justify-center items-center bg-white rounded-full w-full h-full">
                      <Book
                        className="text-[#003666] group-hover:scale-110 transition-transform duration-300"
                        size={28}
                      />
                    </div>
                  </div>
                )}
                {/* Overlay for better text contrast */}
                {bookmark.material?.resource?.resourceAddress && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                )}

                {/* Material Type Badge */}
                <div className="top-3 right-3 absolute bg-white/80 shadow-sm backdrop-blur-sm px-2 py-1 rounded-full font-medium text-[#003666] text-xs">
                  {bookmark.material?.type || "Document"}
                </div>
              </div>

              {/* Content Area */}
              <div className="flex flex-col flex-1 space-y-3 p-4">
                <h3
                  className="font-semibold text-[#003666] text-sm md:text-base truncate tracking-wide"
                  title={bookmark.material?.label}
                >
                  {bookmark.material?.label || "Untitled Material"}
                </h3>
                <p className="text-slate-600 text-xs md:text-sm line-clamp-2">
                  {bookmark.material?.description || "No description available"}
                </p>

                {/* Footer with metadata */}
                <div className="flex justify-between items-center mt-auto pt-2">
                  <span className="flex items-center gap-1 text-slate-500 text-xs">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {bookmark.createdAt
                      ? `Saved ${formatDistanceToNow(
                          new Date(bookmark.createdAt),
                          {
                            addSuffix: true,
                          }
                        )}`
                      : "Recently saved"}
                  </span>

                  {/* View button with hover effect */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-[#003666]/10 hover:bg-[#003666]/20 p-1.5 rounded-full text-[#003666] transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3.5 h-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Animated highlight effect on hover */}
              <div className="group-hover:left-full top-0 -left-full z-10 absolute bg-white/20 w-10 h-full -skew-x-12 transition-all duration-1000 transform" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BookmarkSlider;
