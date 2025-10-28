"use client";

import { type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { PublicKey } from "@solana/web3.js";

interface EventData {
  userId: string | null;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  thumbnailUrl: string;
  date: string;
  venue: string;
  city: string;
  price: number;
}

interface FormSectionProps {
  eventData: EventData;
  setEventData: (data: EventData) => void;
  errors: Record<string, string>;
  onBannerUpload: (url: string) => void;
  onThumbnailUpload: (url: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const CATEGORIES = [
  "Music",
  "Arts",
  "Sports",
  "Technology",
  "Business",
  "Food & Drink",
  "Health",
  "Education",
  "Entertainment",
  "Community",
  "Other",
];

export default function FormSection({
  eventData,
  setEventData,
  errors,
  onBannerUpload,
  onThumbnailUpload,
  onSubmit,
  isSubmitting,
}: FormSectionProps) {
  const validateImage = (file: File): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Invalid file type", {
        description: "Please upload a JPEG, PNG, or WebP image.",
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      toast.error("File size too large", {
        description: `Your file is ${sizeMB}MB. Maximum allowed size is 10MB.`,
      });
      return false;
    }

    return true;
  };

  const handleImageUpload = async (
    file: File,
    type: "banner" | "thumbnail"
  ) => {
    if (!validateImage(file)) {
      throw new Error("Validation failed");
    }

    const toastId = `${type}-upload`;
    toast.loading(`Uploading ${type} image...`, { id: toastId });

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", `events/${type}s`);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (type === "banner") {
        onBannerUpload(data.url);
      } else {
        onThumbnailUpload(data.url);
      }

      toast.success(
        `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`,
        { id: toastId }
      );
    } catch (error: any) {
      toast.error(`Failed to upload ${type}`, {
        id: toastId,
        description: error.message || "Please try again.",
      });
      throw error;
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Title Field */}
      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
        style={{ animationDelay: "0ms" }}
      >
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="title" className="text-sm font-semibold">
            Event Title
          </Label>
          <span className="text-xs text-muted-foreground">
            {eventData.title.length}/100
          </span>
        </div>
        <Input
          id="title"
          type="text"
          maxLength={100}
          required
          placeholder="e.g., Web3 Summit 2025"
          value={eventData.title}
          onChange={(e) =>
            setEventData({ ...eventData, title: e.target.value })
          }
          aria-invalid={!!errors.title}
          className="h-10"
        />
        {errors.title && (
          <p className="mt-2 text-sm text-destructive">{errors.title}</p>
        )}
      </div>

      {/* Category Field */}
      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
        style={{ animationDelay: "50ms" }}
      >
        <Label htmlFor="category" className="text-sm font-semibold mb-2 block">
          Category
        </Label>
        <Select
          value={eventData.category}
          onValueChange={(value: any) =>
            setEventData({ ...eventData, category: value })
          }
          required
        >
          <SelectTrigger className="h-10">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="mt-2 text-sm text-destructive">{errors.category}</p>
        )}
      </div>

      {/* Description Field */}
      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
        style={{ animationDelay: "100ms" }}
      >
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="description" className="text-sm font-semibold">
            Description
          </Label>
          <span className="text-xs text-muted-foreground">
            {eventData.description.length}/500
          </span>
        </div>
        <Textarea
          id="description"
          maxLength={500}
          required
          placeholder="Describe your event, what attendees can expect, and why they should join..."
          value={eventData.description}
          onChange={(e) =>
            setEventData({ ...eventData, description: e.target.value })
          }
          aria-invalid={!!errors.description}
          className="min-h-32 resize-none"
        />
        {errors.description && (
          <p className="mt-2 text-sm text-destructive">{errors.description}</p>
        )}
      </div>

      {/* Date, Venue, and City Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Date Field */}
        <div
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
          style={{ animationDelay: "150ms" }}
        >
          <Label htmlFor="date" className="text-sm font-semibold mb-2 block">
            Event Date & Time
          </Label>
          <Input
            id="date"
            type="datetime-local"
            required
            value={eventData.date}
            onChange={(e) =>
              setEventData({ ...eventData, date: e.target.value })
            }
            aria-invalid={!!errors.date}
            className="h-10"
          />
          {errors.date && (
            <p className="mt-2 text-sm text-destructive">{errors.date}</p>
          )}
        </div>

        {/* Venue Field */}
        <div
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
          style={{ animationDelay: "200ms" }}
        >
          <Label htmlFor="venue" className="text-sm font-semibold mb-2 block">
            Venue
          </Label>
          <Input
            id="venue"
            type="text"
            required
            placeholder="e.g., Convention Center"
            value={eventData.venue}
            onChange={(e) =>
              setEventData({ ...eventData, venue: e.target.value })
            }
            aria-invalid={!!errors.venue}
            className="h-10"
          />
          {errors.venue && (
            <p className="mt-2 text-sm text-destructive">{errors.venue}</p>
          )}
        </div>

        {/* City Field */}
        <div
          className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
          style={{ animationDelay: "250ms" }}
        >
          <Label htmlFor="city" className="text-sm font-semibold mb-2 block">
            City
          </Label>
          <Input
            id="city"
            type="text"
            required
            placeholder="e.g., San Francisco"
            value={eventData.city}
            onChange={(e) =>
              setEventData({ ...eventData, city: e.target.value })
            }
            aria-invalid={!!errors.city}
            className="h-10"
          />
          {errors.city && (
            <p className="mt-2 text-sm text-destructive">{errors.city}</p>
          )}
        </div>
      </div>

      {/* Price Field */}
      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
        style={{ animationDelay: "300ms" }}
      >
        <Label htmlFor="price" className="text-sm font-semibold mb-2 block">
          Ticket Price (USD)
        </Label>
        <Input
          id="price"
          type="number"
          min="0"
          step="0.01"
          required
          placeholder="e.g., 49.99"
          value={eventData.price || ""}
          onChange={(e) =>
            setEventData({
              ...eventData,
              price: parseFloat(e.target.value) || 0,
            })
          }
          aria-invalid={!!errors.price}
          className="h-10"
        />
        {errors.price && (
          <p className="mt-2 text-sm text-destructive">{errors.price}</p>
        )}
      </div>

      {/* Banner Image Upload */}
      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
        style={{ animationDelay: "350ms" }}
      >
        <Label className="text-sm font-semibold mb-3 block">
          Banner Image
          <span className="text-xs text-muted-foreground font-normal ml-2">
            (Recommended: 1200x800px, Max: 10MB)
          </span>
        </Label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-foreground/40 transition-colors">
          <input
            type="file"
            accept={ALLOWED_FILE_TYPES.join(",")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file, "banner");
            }}
            className="hidden"
            id="banner-upload"
          />
          <label htmlFor="banner-upload" className="cursor-pointer">
            <div className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </div>
          </label>
        </div>
        {errors.imageUrl && (
          <p className="mt-2 text-sm text-destructive">{errors.imageUrl}</p>
        )}
        {eventData.imageUrl && (
          <div className="mt-4 animate-in fade-in duration-300">
            <div className="relative rounded-lg overflow-hidden shadow-md">
              <img
                src={eventData.imageUrl}
                alt="Banner preview"
                className="w-full h-48 sm:h-64 object-cover"
              />
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-full">
                <span className="text-white text-sm">✓</span>
                <span className="text-xs font-medium text-white">
                  Banner uploaded
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Image Upload */}
      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
        style={{ animationDelay: "400ms" }}
      >
        <Label className="text-sm font-semibold mb-3 block">
          Thumbnail Image
          <span className="text-xs text-muted-foreground font-normal ml-2">
            (Recommended: 400x300px, Max: 10MB)
          </span>
        </Label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-foreground/40 transition-colors">
          <input
            type="file"
            accept={ALLOWED_FILE_TYPES.join(",")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file, "thumbnail");
            }}
            className="hidden"
            id="thumbnail-upload"
          />
          <label htmlFor="thumbnail-upload" className="cursor-pointer">
            <div className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </div>
          </label>
        </div>
        {errors.thumbnailUrl && (
          <p className="mt-2 text-sm text-destructive">{errors.thumbnailUrl}</p>
        )}
        {eventData.thumbnailUrl && (
          <div className="mt-4 animate-in fade-in duration-300">
            <div className="relative rounded-lg overflow-hidden shadow-md max-w-sm">
              <img
                src={eventData.thumbnailUrl}
                alt="Thumbnail preview"
                className="w-full h-40 object-cover"
              />
              <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/80 px-3 py-1.5 rounded-full">
                <span className="text-white text-sm">✓</span>
                <span className="text-xs font-medium text-white">
                  Thumbnail uploaded
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div
        className="animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
        style={{ animationDelay: "450ms" }}
      >
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
          className="w-full h-11 sm:h-12 font-semibold transition-all duration-200"
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span>Creating Event...</span>
            </div>
          ) : (
            <>
              <span>Create Event</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
