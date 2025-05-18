"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  shape?: "rect" | "circle";
  width?: string | number;
  height?: string | number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className,
  shape = "rect",
  width = "100%",
  height = "1rem",
  style,
  ...props
}) => {
  const skeletonStyle = {
    width,
    height,
    ...style,
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-gray-200 dark:bg-gray-700",
        shape === "circle" ? "rounded-full" : "rounded-md",
        className
      )}
      style={skeletonStyle}
      {...props}
    />
  );
};

export default SkeletonLoader; 