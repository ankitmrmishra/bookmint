"use client";

import { useState, ChangeEvent, useId } from "react";
import { toast } from "sonner";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  onFileSelect?: (file: File) => Promise<void>;
  uploadType?: "banner" | "thumbnail";
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export default function ImageUpload({
  onUploadSuccess,
  onFileSelect,
  uploadType,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | null>(null);
  const inputId = useId();

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload a JPEG, PNG, or WebP image.",
      });
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      toast.error("File size too large", {
        description: `Your file is ${sizeMB}MB. Maximum allowed size is 10MB. Please compress your image or choose a smaller file.`,
      });
      return false;
    }

    return true;
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!validateFile(file)) {
      e.target.value = ""; // Reset input
      return;
    }

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // If onFileSelect is provided, use it (parent handles upload)
    if (onFileSelect) {
      setUploading(true);
      try {
        await onFileSelect(file);
      } finally {
        setUploading(false);
        e.target.value = ""; // Reset input
      }
      return;
    }

    // Otherwise, handle upload here
    setUploading(true);
    const uploadToastId = toast.loading("Uploading image...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (data.url) {
        onUploadSuccess(data.url);
        toast.success("Image uploaded successfully!", { id: uploadToastId });
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Upload failed", {
        id: uploadToastId,
        description: error.message || "Please try again.",
      });
      setPreview(null);
    } finally {
      setUploading(false);
      e.target.value = ""; // Reset input for re-upload
    }
  };

  const clearPreview = () => {
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div className="relative">
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleUpload}
            disabled={uploading}
            className="hidden"
            id={inputId}
          />
          <label
            htmlFor={inputId}
            className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
              uploading
                ? "opacity-50 cursor-not-allowed bg-muted"
                : "hover:bg-muted/50 hover:border-primary"
            }`}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 mb-3 text-primary animate-spin" />
                  <p className="text-sm font-medium text-primary">
                    Uploading {uploadType}...
                  </p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, or WebP (max 10MB)
                  </p>
                </>
              )}
            </div>
          </label>
        </div>
      ) : (
        <div className="relative group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border"
          />
          {uploading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
                <p className="text-sm font-medium text-white">
                  Uploading {uploadType}...
                </p>
              </div>
            </div>
          )}
          {!uploading && (
            <button
              onClick={clearPreview}
              className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full transition-colors opacity-0 group-hover:opacity-100"
              type="button"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
