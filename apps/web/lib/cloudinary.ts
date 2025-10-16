import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate optimized image URL
export function getOptimizedImageUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
  }
) {
  return cloudinary.url(publicId, {
    width: options?.width || 1200,
    height: options?.height || 800,
    crop: options?.crop || "limit",
    quality: options?.quality || "auto",
    fetch_format: "auto",
  });
}

// Generate thumbnail URL
export function getThumbnailUrl(publicId: string) {
  return cloudinary.url(publicId, {
    width: 400,
    height: 300,
    crop: "fill",
    quality: "auto",
    fetch_format: "auto",
  });
}

// Delete image
export async function deleteImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}
