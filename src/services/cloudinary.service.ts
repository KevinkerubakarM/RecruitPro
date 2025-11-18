import { v2 as cloudinary } from "cloudinary";

// Parse Cloudinary URL from environment
const cloudinaryUrl = process.env.CLOUDINARY_URL || "";
const urlMatch = cloudinaryUrl.match(/cloudinary:\/\/(\d+):([^@]+)@(.+)/);

if (!urlMatch) {
  throw new Error("Invalid CLOUDINARY_URL format");
}

const [, apiKey, apiSecret, cloudName] = urlMatch;

// Configure Cloudinary
cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

/**
 * Upload an image to Cloudinary
 * @param file - Base64 string or file path
 * @param folder - Cloudinary folder to upload to
 * @returns Upload result with URL
 */
export async function uploadImage(
  file: string,
  folder: string = "company-branding"
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "image",
      transformation: [
        { width: 2000, height: 2000, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Image upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Upload a video to Cloudinary
 * @param file - Base64 string or file path
 * @param folder - Cloudinary folder to upload to
 * @returns Upload result with URL
 */
export async function uploadVideo(
  file: string,
  folder: string = "company-videos"
): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "video",
      transformation: [
        { width: 1920, height: 1080, crop: "limit" },
        { quality: "auto" },
      ],
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Video upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Upload logo with specific optimizations
 * @param file - Base64 string or file path
 * @returns Upload result with URL
 */
export async function uploadLogo(file: string): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "company-logos",
      resource_type: "image",
      transformation: [
        { width: 500, height: 500, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
        { background: "transparent" },
      ],
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Logo upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Upload banner with specific optimizations
 * @param file - Base64 string or file path
 * @returns Upload result with URL
 */
export async function uploadBanner(file: string): Promise<UploadResult> {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "company-banners",
      resource_type: "image",
      transformation: [
        { width: 2400, height: 800, crop: "fill", gravity: "auto" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Banner upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/**
 * Delete a resource from Cloudinary
 * @param publicId - Public ID of the resource to delete
 * @param resourceType - Type of resource (image or video)
 * @returns Deletion result
 */
export async function deleteResource(
  publicId: string,
  resourceType: "image" | "video" = "image"
): Promise<{ success: boolean; error?: string }> {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Delete failed",
    };
  }
}

export { cloudinary };
