"use client";

import React from "react";
import Card from "@/components/ui/card/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { Advertisement } from "@/api/review.api";
import {
  Eye,
  Link as LinkIcon,
  Clock,
  Tag,
  X,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

interface AdvertDetailProps {
  advert: Advertisement;
  onClose?: () => void;
}

const AdvertDetail: React.FC<AdvertDetailProps> = ({ advert, onClose }) => {
  const formatAdvertType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  const getAdvertColorClass = (type: string) => {
    switch (type.toLowerCase()) {
      case "free":
        return "bg-green-100 text-green-700";
      case "pro":
        return "bg-blue-100 text-blue-700";
      case "boost":
        return "bg-purple-100 text-purple-700";
      case "targeted":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="relative">
      {/* Header with close button */}
      <div className="top-0 z-10 sticky flex justify-between items-center bg-white px-6 py-4 border-b">
        <h2 className="font-bold text-xl">Advertisement Preview</h2>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="p-6">
        <Card className="bg-white/80 backdrop-blur-sm overflow-hidden">
          {/* Image Section */}
          {advert.imageUrl && (
            <div className="relative bg-gray-100 w-full h-64 md:h-80">
              <img
                src={advert.imageUrl}
                alt={advert.label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "/Image/blank-book-cover-white-vector-illustration.png";
                }}
              />
              <div className="top-4 right-4 absolute">
                <Badge
                  className={`${getAdvertColorClass(advert.type)} capitalize`}
                >
                  {formatAdvertType(advert.type)}
                </Badge>
              </div>
            </div>
          )}

          <div className="p-6">
            {/* Title and Description */}
            <div className="mb-6">
              <h1 className="mb-2 font-bold text-gray-900 text-2xl">
                {advert.label}
              </h1>
              <p className="text-gray-700">
                {advert.description || "No description available"}
              </p>
            </div>

            {/* Stats Section */}
            <div className="gap-6 grid grid-cols-1 md:grid-cols-2 mb-6">
              <div>
                <h3 className="mb-2 font-semibold text-lg">Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>
                      Created: {new Date(advert.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {advert.material && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <LinkIcon className="w-4 h-4" />
                      <span>Linked to Material: {advert.material.label}</span>
                    </div>
                  )}

                  {advert.collection && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Tag className="w-4 h-4" />
                      <span>Collection: {advert.collection.name}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">Created by: </span>
                    <span>
                      {advert.creator.firstName} {advert.creator.lastName}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold text-lg">Performance</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Eye className="w-4 h-4" />
                    <span>{advert.views} Views</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <ExternalLink className="w-4 h-4" />
                    <span>{advert.clicks} Clicks</span>
                  </div>
                  {advert.clicks > 0 && advert.views > 0 && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="font-medium">CTR: </span>
                      <span>
                        {((advert.clicks / advert.views) * 100).toFixed(2)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Review Status Information */}
            {advert.reviewStatus !== "PENDING" && advert.reviewedBy && (
              <div className="mt-6 pt-4 border-gray-100 border-t">
                <h3 className="mb-2 font-semibold text-lg">
                  Review Information
                </h3>
                <div className="flex items-center gap-2">
                  <Badge
                    className={
                      advert.reviewStatus === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {advert.reviewStatus}
                  </Badge>
                  <span className="text-gray-600">
                    by {advert.reviewedBy.firstName}{" "}
                    {advert.reviewedBy.lastName}
                  </span>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdvertDetail;
