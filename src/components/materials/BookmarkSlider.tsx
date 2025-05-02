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
              className="group relative flex flex-col bg-[#003666]/60 backdrop-blur-md border border-white/10 shadow-md hover:shadow-cyan-400/30 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer w-full hover:scale-[1.015]"
              onClick={() => handleBookmarkClick(bookmark)}
            >
              <div className="relative w-full h-44 md:h-36 bg-gradient-to-br from-[#004b8d] via-[#003666] to-[#001f33] animate-gradient-x flex items-center justify-center overflow-hidden">
                {bookmark.material?.resource?.resourceAddress ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:scale-105"
                    style={{
                      backgroundImage: `url(${bookmark.material.resource.resourceAddress})`,
                    }}
                  />
                ) : (
                  <div className="z-10">
                    <Book
                      className="text-cyan-300 drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                      size={36}
                    />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40" />
              </div>

              <div className="flex flex-col flex-1 p-4 space-y-2 text-white">
                <h3
                  className="text-sm md:text-base font-semibold tracking-wide truncate"
                  title={bookmark.material?.label}
                >
                  {bookmark.material?.label || "Untitled Material"}
                </h3>
                <p className="text-xs md:text-sm text-gray-300 line-clamp-2">
                  {bookmark.material?.description || "No description available"}
                </p>
                <div className="mt-auto">
                  <span className="text-[10px] text-cyan-200/70 italic">
                    {bookmark.createdAt
                      ? `Saved ${formatDistanceToNow(
                          new Date(bookmark.createdAt),
                          {
                            addSuffix: true,
                          }
                        )}`
                      : "Recently saved"}
                  </span>
                </div>
              </div>

              <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BookmarkSlider;
