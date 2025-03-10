import { z } from 'zod';

const createTypeValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .nonempty("Category name is required")
      .max(100, "Category name should not exceed 100 characters"),
    description: z.string().optional(),
    parent: z.string().optional().nullable()
  })
});


const updateTypeValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .max(100, "Category name should not exceed 100 characters")
      .optional(),
    description: z.string().optional(),
    parent: z.string().optional().nullable(),
    isActive: z.boolean().optional()
  })
});

export const categoryValidation = {
  createTypeValidationSchema,
  updateTypeValidationSchema
}