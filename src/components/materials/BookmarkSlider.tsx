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
              className="flex bg-white shadow-md rounded-lg h-24 overflow-hidden cursor-pointer"
              onClick={() => handleBookmarkClick(bookmark)}
            >
              <div className="flex-shrink-0 w-24 h-24">
                {bookmark.material ? (
                  <div className="relative flex justify-center items-center bg-gradient-to-r from-blue-100 to-blue-50 h-full">
                    {bookmark.material.resource?.resourceAddress ? (
                      <div
                        className="bg-cover bg-center w-full h-full"
                        style={{
                          backgroundImage: `url(${bookmark.material.resource.resourceAddress})`,
                        }}
                      />
                    ) : (
                      <div className="flex justify-center items-center w-full h-full">
                        <Book size={32} className="text-blue-500" />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex justify-center items-center bg-gray-200 w-full h-full">
                    <Book size={32} className="text-gray-400" />
                  </div>
                )}
              </div>

              <div className="flex flex-col flex-1 p-3">
                <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                  {bookmark.material
                    ? bookmark.material.label
                    : "Untitled Material"}
                </h3>
                <p className="mb-1 text-gray-500 text-xs line-clamp-2">
                  {bookmark.material?.description || "No description available"}
                </p>
                <div className="mt-auto">
                  <span className="text-gray-400 text-xs">
                    {bookmark.createdAt
                      ? `Saved ${formatDistanceToNow(
                          new Date(bookmark.createdAt),
                          { addSuffix: true }
                        )}`
                      : "Recently saved"}
                  </span>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BookmarkSlider;
