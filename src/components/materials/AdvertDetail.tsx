"use client";

import React, { useState, useEffect } from "react";
import { getAdvertById } from "@/api/advert.api";
import {
  Advert,
  ApprovalStatusEnum,
  AdvertTypeEnum,
} from "@/lib/types/response.type";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Image as ImageIcon,
  ExternalLink,
  Calendar,
  User,
  Clock,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AdvertDetailProps {
  advertId: string;
  initialAdvert?: Advert;
  onClose: () => void;
  isOpen: boolean;
}

const AdvertDetail: React.FC<AdvertDetailProps> = ({
  advertId,
  initialAdvert,
  onClose,
  isOpen,
}) => {
  const [advert, setAdvert] = useState<Advert | null>(initialAdvert || null);
  const [loading, setLoading] = useState<boolean>(!initialAdvert);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the advert by ID to get the latest data (especially if the imageUrl expired)
    const fetchAdvert = async () => {
      try {
        setLoading(true);
        const response = await getAdvertById(advertId);
        if (response?.status === "success") {
          setAdvert(response.data);
        } else {
          setError("Failed to load advertisement details");
        }
      } catch (err) {
        console.error("Error fetching advert:", err);
        setError("An error occurred while loading the advertisement");
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchAdvert();
    }
  }, [advertId, isOpen]);

  const formatAdvertType = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  };

  const getAdvertTypeClass = (type: string) => {
    switch (type.toLowerCase()) {
      case AdvertTypeEnum.FREE.toLowerCase():
        return "bg-green-100 text-green-700";
      case AdvertTypeEnum.PAID.toLowerCase():
        return "bg-blue-100 text-blue-700";
      case AdvertTypeEnum.BOOST.toLowerCase():
        return "bg-purple-100 text-purple-700";
      case AdvertTypeEnum.TARGETED.toLowerCase():
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="border-b-2 border-blue-700 rounded-full w-12 h-12 animate-spin"></div>
        </div>
      );
    }

    if (error || !advert) {
      return (
        <div className="py-10 text-center">
          <p className="mb-4 text-red-500">
            {error || "Advertisement not found"}
          </p>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      );
    }

    return (
      <div className="gap-6 grid md:grid-cols-[2fr,1fr]">
        <div>
          {/* Main image */}
          <div className="relative bg-gray-100 mb-6 rounded-md aspect-video overflow-hidden">
            {advert.imageUrl ? (
              <img
                src={advert.imageUrl}
                alt={advert.label}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "/Image/blank-book-cover-white-vector-illustration.png";
                }}
              />
            ) : (
              <div className="flex justify-center items-center h-full">
                <ImageIcon className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Advertisement description */}
          <div className="mb-6">
            <h3 className="mb-2 font-medium text-lg">Description</h3>
            <p className="text-gray-700">
              {advert.description || "No description provided."}
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="mb-4 font-medium text-lg">Advertisement Details</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Type</span>
                <Badge
                  className={`${getAdvertTypeClass(advert.type)} capitalize`}
                >
                  {formatAdvertType(advert.type)}
                </Badge>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Views</span>
                <span className="font-medium">{advert.views}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">Clicks</span>
                <span className="font-medium">{advert.clicks}</span>
              </div>

              {advert.reviewStatus && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <Badge
                    className={
                      advert.reviewStatus === ApprovalStatusEnum.APPROVED
                        ? "bg-green-100 text-green-700"
                        : advert.reviewStatus === ApprovalStatusEnum.REJECTED
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {advert.reviewStatus}
                  </Badge>
                </div>
              )}

              {/* Created by */}
              {advert.creator && (
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 w-4 h-4 text-gray-500" />
                  <div>
                    <span className="block text-gray-500 text-sm">
                      Created by
                    </span>
                    <span className="font-medium">
                      {advert.creator.firstName} {advert.creator.lastName}
                      {advert.creator.username &&
                        ` (${advert.creator.username})`}
                    </span>
                  </div>
                </div>
              )}

              {/* Created at */}
              {advert.createdAt && (
                <div className="flex items-start gap-2">
                  <Calendar className="mt-0.5 w-4 h-4 text-gray-500" />
                  <div>
                    <span className="block text-gray-500 text-sm">
                      Created on
                    </span>
                    <span className="font-medium">
                      {format(new Date(advert.createdAt), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              )}

              {/* Reviewed by */}
              {advert.reviewedBy && (
                <div className="flex items-start gap-2">
                  <User className="mt-0.5 w-4 h-4 text-gray-500" />
                  <div>
                    <span className="block text-gray-500 text-sm">
                      Reviewed by
                    </span>
                    <span className="font-medium">
                      {advert.reviewedBy.firstName} {advert.reviewedBy.lastName}
                      {advert.reviewedBy.username &&
                        ` (${advert.reviewedBy.username})`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Links to related content */}
          {(advert.material || advert.collection) && (
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="mb-4 font-medium text-lg">Related Content</h3>

              {advert.material && (
                <div className="mb-3">
                  <span className="block mb-1 text-gray-500 text-sm">
                    Linked Material
                  </span>
                  <Link
                    href={`/dashboard/materials/${advert.material.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {advert.material.label}
                  </Link>
                </div>
              )}

              {advert.collection && (
                <div>
                  <span className="block mb-1 text-gray-500 text-sm">
                    In Collection
                  </span>
                  <Link
                    href={`/dashboard/collections/${advert.collection.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {advert.collection.label}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="font-bold text-2xl">
            {!loading && advert ? advert.label : "Advertisement"}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-2">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvertDetail;
