import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";

/**
 * POST /api/v1/upload
 * Accepts: multipart/form-data with a "file" field
 * Returns: { url, public_id, resource_type, format, bytes, original_name }
 *
 * Usage:
 *  1. Call this endpoint to upload any file
 *  2. Use the returned `url` in the JSON body of other API calls
 */
const uploadFile = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "No file provided. Send a file in the 'file' field.");
  }

  // Cloudinary file info is attached by multer-storage-cloudinary
  const file = req.file as Express.Multer.File & {
    path: string;
    filename: string;
    fieldname: string;
  };

  const cloudinaryFile = file as any;

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "File uploaded successfully",
    data: {
      url: cloudinaryFile.path,           // Full secure Cloudinary URL
      public_id: cloudinaryFile.filename,  // Cloudinary public_id
      resource_type: cloudinaryFile.resource_type || "auto",
      format: cloudinaryFile.mimetype,
      bytes: cloudinaryFile.size,
      original_name: cloudinaryFile.originalname,
    },
  });
});

export const UploadController = { uploadFile };
