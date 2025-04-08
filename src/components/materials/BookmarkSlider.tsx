"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Bookmark } from "@/lib/types/response.type";
import { formatDistanceToNow } from "date-fns";
import { Book } from "lucide-react";

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
            <div className="flex flex-col bg-white shadow-md rounded-lg h-full overflow-hidden">
              {bookmark.material ? (
                <div className="relative flex justify-center items-center bg-gradient-to-r from-blue-100 to-blue-50 aspect-square square-container">
                  {bookmark.material.resource?.resourceAddress ? (
                    <div
                      className="bg-cover bg-center w-full h-40"
                      style={{
                        backgroundImage: `url(${bookmark.material.resource.resourceAddress})`,
                      }}
                    />
                  ) : (
                    <div className="flex flex-col justify-center items-center w-full h-40">
                      <Book size={48} className="mb-2 text-blue-500" />
                      <div className="text-gray-600 text-sm">
                        {bookmark.material.type || "Material"}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-center items-center bg-gray-200 w-full h-40">
                  <Book size={48} className="text-gray-400" />
                </div>
              )}

              <div className="flex flex-col flex-1 p-4">
                <h3 className="mb-1 font-medium text-gray-900 line-clamp-2">
                  {bookmark.material
                    ? bookmark.material.label
                    : "Untitled Material"}
                </h3>
                <p className="flex-1 mb-2 text-gray-500 text-sm line-clamp-3">
                  {bookmark.material?.description || "No description available"}
                </p>
                <div className="mt-auto">
                  <div className="flex justify-between items-center text-gray-500 text-xs">
                    <span>
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
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BookmarkSlider;
