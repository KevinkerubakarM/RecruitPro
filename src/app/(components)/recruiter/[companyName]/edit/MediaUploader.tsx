"use client";

import { useState, useRef, cache } from "react";
import { MediaUploaderProps } from "@/types/app/(components)/recruiter/edit.type";
import { getUserData } from "@/lib/helper";

export default function MediaUploader({
  type,
  currentUrl,
  onUpload,
  onDelete,
  label,
}: MediaUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (type === "video" && !file.type.startsWith("video/")) {
      setError("Please select a valid video file");
      return;
    }

    if (type !== "video" && !file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (10MB for images, 50MB for videos)
    const maxSize = type === "video" ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`File size must be less than ${type === "video" ? "50MB" : "10MB"}`);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;

        // Get user data from localStorage
        const userData = getUserData();
        const userId = userData?.userId || "";

        // Upload to server
        const response = await fetch("/api/recruiter/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-user-id": userId,
          },
          body: JSON.stringify({
            file: base64,
            type,
          }),
          cache: "no-store",
        });

        const data = await response.json();

        if (data.success && data.data.url) {
          onUpload(data.data.url);
        } else {
          setError(data.error?.message || "Upload failed");
        }

        setIsUploading(false);
      };

      reader.onerror = () => {
        setError("Failed to read file");
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError("Upload failed. Please try again.");
      setIsUploading(false);
    }
  };

  const getAcceptType = () => {
    switch (type) {
      case "video":
        return "video/*";
      case "logo":
      case "banner":
      case "image":
        return "image/*";
      default:
        return "*/*";
    }
  };

  const getPreviewDimensions = () => {
    switch (type) {
      case "logo":
        return "w-32 h-32";
      case "banner":
        return "w-full h-48";
      case "video":
        return "w-full h-64";
      case "image":
        return "w-full h-48";
      default:
        return "w-full h-48";
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {currentUrl ? (
        <div className="relative">
          {type === "video" ? (
            <video
              src={currentUrl}
              controls
              className={`${getPreviewDimensions()} object-cover rounded-lg`}
            />
          ) : (
            <img
              src={currentUrl}
              alt={label}
              className={`${getPreviewDimensions()} object-cover rounded-lg`}
            />
          )}

          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 bg-white text-gray-700 rounded-lg shadow-md hover:bg-gray-50 text-sm font-medium"
              disabled={isUploading}
            >
              Replace
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-3 py-1 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 text-sm font-medium"
                disabled={isUploading}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`${getPreviewDimensions()} border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 transition-colors bg-gray-50`}
        >
          {isUploading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
            </div>
          ) : (
            <div className="text-center p-4">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">Click to upload {type}</p>
              <p className="text-xs text-gray-500 mt-1">
                {type === "video" ? "MP4, MOV up to 50MB" : "PNG, JPG up to 10MB"}
              </p>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptType()}
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
