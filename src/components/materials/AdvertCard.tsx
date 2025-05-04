"use client";

import React, { useState } from "react";
import { Advert } from "@/lib/types/response.type";
import {
  Megaphone,
  ExternalLink,
  MousePointer,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import AdvertDetail from "./AdvertDetail";
import { incrementClick } from "@/api/advert.api";

interface AdvertCardProps {
  advert: Advert;
  onClick?: () => void;
  isPreview?: boolean; // Used when shown in material details
  className?: string;
}

const AdvertCard: React.FC<AdvertCardProps> = ({
  advert,
  onClick,
  isPreview = false,
  className,
}) => {
  const [showDetail, setShowDetail] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setShowDetail(true);
    }
    incrementClick(advert.id);
  };

  const handleCloseModal = () => {
    setShowDetail(false);
  };

  return (
    <>
      <div
        className={cn(
          "relative overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md",
          isPreview ? "mb-6" : "",
          onClick || !isPreview ? "cursor-pointer" : "",
          className
        )}
        onClick={handleClick}
      >
        {/* Review Status Indicator */}
        {advert.reviewStatus === "pending" && (
          <div className="top-2 right-2 z-10 absolute">
            <Badge
              variant="outline"
              className="flex items-center gap-1 bg-yellow-50 border-yellow-200 text-yellow-700"
            >
              <AlertTriangle className="w-3 h-3" />
              Pending Review
            </Badge>
          </div>
        )}

        {/* Ad Image */}
        {advert.imageUrl ? (
          <div className="w-full aspect-video overflow-hidden">
            <img
              src={advert.imageUrl}
              alt={advert.label}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ) : (
          <div className="flex justify-center items-center bg-blue-50 w-full aspect-video">
            <Megaphone className="w-12 h-12 text-blue-300" />
          </div>
        )}

        <div className="p-4">
          {/* Ad Type Badge */}
          <div className="flex justify-between items-start mb-2">
            {!isPreview && (
              <Badge
                variant={advert.type === "free" ? "secondary" : "default"}
                className={
                  advert.type === "free"
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : ""
                }
              >
                {advert.type}
              </Badge>
            )}

            {!isPreview && (
              <div className="flex gap-2 text-gray-500 text-xs">
                <span className="flex items-center">
                  <Eye className="mr-1 w-3 h-3" />
                  {advert.views}
                </span>
                <span className="flex items-center">
                  <MousePointer className="mr-1 w-3 h-3" />
                  {advert.clicks}
                </span>
              </div>
            )}
          </div>

          <h3 className="mb-1 font-medium text-gray-900 line-clamp-2">
            {advert.label}
          </h3>

          {!isPreview && advert.description && (
            <p className="mb-3 text-gray-600 text-sm line-clamp-2">
              {advert.description}
            </p>
          )}

          {/* Link to associated material */}
          {!isPreview && advert.material && (
            <div className="flex items-center mt-2 text-blue-600 text-sm">
              <ExternalLink className="mr-1 w-3 h-3" />
              <span className="line-clamp-1">{advert.material.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      <AdvertDetail
        advertId={advert.id}
        initialAdvert={advert}
        onClose={handleCloseModal}
        isOpen={showDetail}
      />
    </>
  );
};

export default AdvertCard;
