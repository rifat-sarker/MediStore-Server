import { Router } from "express";
import { UploadController } from "./upload.controller";
import { multerUpload } from "../../config/multer.config";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = Router();

/**
 * POST /api/v1/upload
 *
 * Upload any file (image, video, PDF, doc, etc.) to Cloudinary.
 * Auth required.
 *
 * Request: multipart/form-data  →  field name: "file"
 * Response: { url, public_id, resource_type, format, bytes, original_name }
 *
 * Workflow:
 *   1. POST to /api/v1/upload with your file → get URL back
 *   2. Use that URL as a string field in any JSON API request body
 */
router.post(
  "/",
  auth(Role.ADMIN, Role.CUSTOMER, Role.RIDER),
  multerUpload.single("file"),
  UploadController.uploadFile
);

export const UploadRoutes = router;
