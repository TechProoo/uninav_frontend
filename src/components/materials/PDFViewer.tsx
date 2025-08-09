"use client";

import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface PDFViewerProps {
  url: string;
}

export default function PDFViewer({ url }: PDFViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isExpanded
            ? "fixed inset-0 z-50 bg-white"
            : "w-full h-[400px] relative"
        )}
      >
        <Button
          variant="outline"
          size="sm"
          className="absolute top-2 right-2 z-10"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
        <iframe
          src={url}
          className="w-full h-full rounded-lg"
          title="PDF Viewer"
        />
      </div>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleExpand}
        />
      )}
    </div>
  );
}
