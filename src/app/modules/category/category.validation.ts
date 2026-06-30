import { z } from "zod";

const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Category name is required" })
      .min(1)
      .max(100),
    // imageUrl: upload via POST /api/v1/upload first, then pass the URL here
    imageUrl: z.string().url("Must be a valid URL").optional(),
  }),
});

const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    imageUrl: z.string().url("Must be a valid URL").optional(),
  }),
});

export const categoryValidation = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};