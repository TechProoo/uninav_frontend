"use client";

import React from "react";
import { PlusCircle, X, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface UrlItem {
  id: string;
  url: string;
  title: string;
}

interface UrlInputListProps {
  urls: UrlItem[];
  onAddUrl: () => void;
  onRemoveUrl: (id: string) => void;
  onUpdateUrl: (id: string, url: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onUpdateMaterialType?: (id: string, type: string) => void;
  maxUrls?: number;
}

const UrlInputList: React.FC<UrlInputListProps> = ({
  urls,
  onAddUrl,
  onRemoveUrl,
  onUpdateUrl,
  onUpdateTitle,
  onUpdateMaterialType,
  maxUrls = Infinity,
}) => {
  // Try to extract a descriptive title from a URL
  const handleUrlChange = (id: string, newUrl: string) => {
    onUpdateUrl(id, newUrl);

    // Auto-extract title from URL if the title field is empty
    const currentItem = urls.find((item) => item.id === id);
    if (currentItem && !currentItem.title.trim() && newUrl.trim()) {
      try {
        const url = new URL(newUrl);
        const pathSegments = url.pathname.split("/").filter(Boolean);
        if (pathSegments.length > 0) {
          const lastSegment = decodeURIComponent(
            pathSegments[pathSegments.length - 1]
          );
          // Remove potential file extension from URL segment
          const labelFromUrl = lastSegment.includes(".")
            ? lastSegment.substring(0, lastSegment.lastIndexOf("."))
            : lastSegment;

          if (labelFromUrl.trim()) {
            onUpdateTitle(id, labelFromUrl);
          }
        }

        // Try to infer material type from URL
        if (onUpdateMaterialType) {
          // Use the provided algorithm to infer material type
          const inferMaterialTypeFromUrl = (inputUrl: string): string => {
            try {
              const parsedUrl = new URL(inputUrl);
              const hostname = parsedUrl.hostname.toLowerCase();
              const pathname = parsedUrl.pathname.toLowerCase();
              if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
                return "video"; // Corresponds to MaterialTypeEnum.VIDEO
              }
              if (hostname.includes('vimeo.com')) {
                return "video"; // Corresponds to MaterialTypeEnum.VIDEO
              }
              if (pathname.endsWith('.pdf')) {
                return "pdf"; // Corresponds to MaterialTypeEnum.PDF
              }
              if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(pathname)) {
                return "image"; // Corresponds to MaterialTypeEnum.IMAGE
              }
              if (hostname.includes('medium.com') ||
                  hostname.includes('blogspot.com') ||
                  hostname.includes('wordpress.com')) {
                return "article"; // Corresponds to MaterialTypeEnum.ARTICLE
              }

              return "article"; // Corresponds to MaterialTypeEnum.ARTICLE
            } catch {
              return "other"; // Corresponds to MaterialTypeEnum.OTHER
            }
          };
          
          const materialType = inferMaterialTypeFromUrl(newUrl);
          onUpdateMaterialType(id, materialType);
        }
      } catch (error) {
        if (onUpdateMaterialType) {
          onUpdateMaterialType(id, 'other');
        }
      }
    }
  };

  return (
    <div className="space-y-3">
      {/* URL Inputs */}
      <div className="space-y-2">
        {urls.map((urlItem) => (
          <div
            key={urlItem.id}
            className="flex sm:flex-row flex-col gap-2 bg-gray-50 p-3 border border-gray-200 rounded-lg"
          >
            <div className="flex-grow">
              <label className="block mb-1 text-gray-600 text-xs">URL</label>
              <div className="flex gap-2">
                <div className="flex items-center bg-gray-100 px-2 border-gray-300 border-y border-l rounded-l">
                  <Link className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="url"
                  value={urlItem.url}
                  onChange={(e) => handleUrlChange(urlItem.id, e.target.value)}
                  className="flex-grow p-1.5 border border-gray-300 rounded-r text-sm"
                  placeholder="https://example.com/resource"
                />
              </div>
            </div>

            <div className="flex-grow">
              <label className="block mb-1 text-gray-600 text-xs">Title</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlItem.title}
                  onChange={(e) => onUpdateTitle(urlItem.id, e.target.value)}
                  className="flex-grow p-1.5 border border-gray-300 rounded text-sm"
                  placeholder="Material title"
                />
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-shrink-0 p-0 w-8 h-8"
                  onClick={() => onRemoveUrl(urlItem.id)}
                >
                  <X className="w-4 h-4 text-gray-500" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add URL Button */}
      <Button
        type="button"
        variant="outline"
        onClick={onAddUrl}
        disabled={urls.length >= maxUrls}
        className="flex justify-center items-center gap-1 border-dashed w-full"
      >
        <PlusCircle className="w-4 h-4" />
        Add URL
      </Button>

      {urls.length >= maxUrls && (
        <p className="text-amber-600 text-xs">
          Maximum number of URLs reached ({maxUrls})
        </p>
      )}
    </div>
  );
};

export default UrlInputList;
