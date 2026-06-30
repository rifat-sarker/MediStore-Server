import { z } from "zod";

const createMedicineValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }).min(1).max(200),
    description: z.string({ required_error: "Description is required" }).min(1),
    price: z.number({ required_error: "Price is required" }).min(0),
    stock: z.number({ required_error: "Stock is required" }).int().min(0),
    requiredPrescription: z.boolean().optional().default(false),
    manufacturer: z.string({ required_error: "Manufacturer is required" }).min(1),
    expiryDate: z.string({ required_error: "Expiry date is required" }),
    categoryId: z.string({ required_error: "Category ID is required" }).min(1),
    // imageUrl is obtained via POST /api/v1/upload — pass the returned url here
    imageUrl: z.string().url("Must be a valid URL").optional(),
  }),
});

const updateMedicineValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200).optional(),
    description: z.string().min(1).optional(),
    price: z.number().min(0).optional(),
    stock: z.number().int().min(0).optional(),
    requiredPrescription: z.boolean().optional(),
    manufacturer: z.string().min(1).optional(),
    expiryDate: z.string().optional(),
    categoryId: z.string().min(1).optional(),
    imageUrl: z.string().url("Must be a valid URL").optional(),
  }),
});

export const MedicineValidation = {
  createMedicineValidationSchema,
  updateMedicineValidationSchema,
};
