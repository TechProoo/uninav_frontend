"use client";

import React, { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";

export interface UploadProgressItem {
  id: string;
  title: string;
  progress: number; // 0 to 100
  status: "waiting" | "uploading" | "success" | "error";
  error?: string;
}

interface UploadProgressBarProps {
  items: UploadProgressItem[];
  totalProgress: number; // 0 to 100
  isUploading: boolean;
}

const UploadProgressBar: React.FC<UploadProgressBarProps> = ({
  items,
  totalProgress,
  isUploading,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Show the progress bar as soon as uploading starts
  useEffect(() => {
    if (isUploading) {
      setIsVisible(true);
    }
  }, [isUploading]);

  // Hide the progress bar 3 seconds after all uploads are complete
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!isUploading && totalProgress === 100) {
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isUploading, totalProgress]);

  if (!isVisible) return null;

  return (
    <div className="top-0 right-0 left-0 z-50 fixed bg-white shadow-md p-3 border-gray-200 border-b animate-slideDown">
      <div className="mx-auto max-w-7xl container">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-sm">
            {isUploading
              ? "Uploading materials..."
              : totalProgress === 100
                ? "Upload complete!"
                : "Upload paused"}
          </h3>
          <p className="text-gray-600 text-xs">
            {Math.round(totalProgress)}% complete
          </p>
        </div>

        {/* Main progress bar */}
        <div className="bg-gray-200 mb-4 rounded-full w-full h-2">
          <div
            className="bg-blue-600 rounded-full h-2 transition-all duration-300"
            style={{ width: `${totalProgress}%` }}
          />
        </div>

        {/* Individual item progress */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-xs">
              {item.status === "waiting" && (
                <div className="flex-shrink-0 border border-gray-300 rounded-full w-4 h-4" />
              )}
              {item.status === "uploading" && (
                <Loader2 className="flex-shrink-0 w-4 h-4 text-blue-500 animate-spin" />
              )}
              {item.status === "success" && (
                <Check className="flex-shrink-0 w-4 h-4 text-green-500" />
              )}
              {item.status === "error" && (
                <span className="flex flex-shrink-0 justify-center items-center bg-red-500 rounded-full w-4 h-4 text-[10px] text-white">
                  !
                </span>
              )}

              <span className="flex-grow truncate">
                {item.title || "Untitled material"}
              </span>

              {item.status === "error" ? (
                <span className="text-red-500">Failed</span>
              ) : (
                <span className="text-gray-500">
                  {Math.round(item.progress)}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UploadProgressBar;
