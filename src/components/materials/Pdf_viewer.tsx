"use client";
import { useEffect, useRef, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "../ui/button";

interface ViewerProps {
  pdfUrl?: string;
}

export default function Viewer({ pdfUrl = "/vv.pdf" }: ViewerProps) {
  const containerRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const { NutrientViewer } = window;

    if (container && NutrientViewer) {
      NutrientViewer.load({
        container,
        document: pdfUrl,
      });
    }

    return () => {
      NutrientViewer?.unload(container);
    };
  }, [pdfUrl]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`relative transition-all duration-300 ease-in-out ${
          isExpanded
            ? "fixed inset-0 z-50 bg-white"
            : "w-full h-[400px] rounded-lg border border-gray-200"
        }`}
      />
      <Button
        variant="outline"
        size="sm"
        className="absolute top-2 right-2 z-[51]"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </div>
  );
}
