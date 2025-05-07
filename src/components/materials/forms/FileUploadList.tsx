"use client";

import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import {
  Upload,
  X,
  File as FileIcon,
  Image,
  FileText,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FileItem {
  file: File;
  id: string;
  preview?: string;
  title: string;
}

interface FileUploadListProps {
  files: FileItem[];
  onAddFiles: (newFiles: File[]) => void;
  onRemoveFile: (id: string) => void;
  onUpdateTitle: (id: string, title: string) => void;
  maxFiles?: number;
}

const FileUploadList: React.FC<FileUploadListProps> = ({
  files,
  onAddFiles,
  onRemoveFile,
  onUpdateTitle,
  maxFiles = Infinity,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (files.length + acceptedFiles.length > maxFiles) {
        // Only add up to the maximum allowed files
        onAddFiles(acceptedFiles.slice(0, maxFiles - files.length));
      } else {
        onAddFiles(acceptedFiles);
      }
    },
    multiple: true,
  });

  const getFileIcon = (file: File) => {
    const fileType = file.type.split("/")[0];
    switch (fileType) {
      case "image":
        return <Image className="w-5 h-5 text-green-500" />;
      case "video":
        return <Video className="w-5 h-5 text-blue-500" />;
      case "application":
        return file.type.includes("pdf") ? (
          <FileText className="w-5 h-5 text-red-500" />
        ) : (
          <FileIcon className="w-5 h-5 text-gray-500" />
        );
      default:
        return <FileIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
      >
        <input {...getInputProps()} disabled={files.length >= maxFiles} />
        <div className="flex flex-col items-center space-y-2">
          <Upload className="w-8 h-8 text-gray-400" />
          {isDragActive ? (
            <p className="text-sm">Drop the files here...</p>
          ) : (
            <p className="text-gray-600 text-sm">
              {files.length >= maxFiles
                ? "Maximum number of files reached"
                : "Drag & drop files here, or click to select files"}
            </p>
          )}
          <p className="text-gray-500 text-xs">
            {files.length} of {maxFiles === Infinity ? "unlimited" : maxFiles}{" "}
            files added
          </p>
        </div>
      </div>

      {/* File List */}
      <div className="space-y-2 mt-4">
        {files.length > 0 && (
          <h3 className="font-medium text-gray-700 text-sm">Added Files:</h3>
        )}
        {files.map((fileItem) => (
          <div
            key={fileItem.id}
            className="flex items-center gap-3 bg-gray-50 p-3 border border-gray-200 rounded-lg"
          >
            <div className="flex-shrink-0">
              {fileItem.preview ? (
                <div className="relative w-10 h-10">
                  <img
                    src={fileItem.preview}
                    alt="Preview"
                    className="rounded w-10 h-10 object-cover"
                  />
                </div>
              ) : (
                <div className="flex justify-center items-center bg-gray-100 rounded w-10 h-10">
                  {getFileIcon(fileItem.file)}
                </div>
              )}
            </div>
            <div className="flex-grow min-w-0">
              <input
                type="text"
                value={fileItem.title}
                onChange={(e) => onUpdateTitle(fileItem.id, e.target.value)}
                className="p-1 border border-gray-300 rounded w-full text-sm"
                placeholder="Material title"
              />
              <p className="mt-1 text-gray-500 text-xs truncate">
                {fileItem.file.name} ({(fileItem.file.size / 1024).toFixed(1)}{" "}
                KB)
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              className="flex-shrink-0 p-0 w-8 h-8"
              onClick={() => onRemoveFile(fileItem.id)}
            >
              <X className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploadList;
