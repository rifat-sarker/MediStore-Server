import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

// Supports: images, videos, raw files (docs, PDFs, etc.)
// Cloudinary auto-detects resource_type when set to "auto"
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (_req, file) => {
    const mimeType = file.mimetype;

    // Determine Cloudinary folder and resource type
    let folder = "medistore/misc";
    let resourceType: "image" | "video" | "raw" | "auto" = "auto";

    if (mimeType.startsWith("image/")) {
      folder = "medistore/images";
      resourceType = "image";
    } else if (mimeType.startsWith("video/")) {
      folder = "medistore/videos";
      resourceType = "video";
    } else {
      // PDFs, docs, xls, zip, etc.
      folder = "medistore/documents";
      resourceType = "raw";
    }

    return {
      folder,
      resource_type: resourceType,
      // Keep the original file extension for raw files
      format: mimeType.startsWith("image/") ? undefined : undefined,
    };
  },
});

// Accept any file, up to 50 MB
export const multerUpload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
});