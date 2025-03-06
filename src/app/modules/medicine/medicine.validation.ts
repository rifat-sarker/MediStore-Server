import { z } from "zod";

const createMedicineValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Medicine name is required")
      .max(100, "Name should be less than 100 characters")
      .nonempty(),
    description: z.string().nonempty("Description is required"),
    price: z.number().min(0, "Price must be greater than or equal to 0"),
    stock: z.number().min(0, "Stock must be greater than or equal to 0"),
    availability: z
      .boolean()
      .refine((value) => value === true || value === false, {
        message: "InStock must be true or false",
      }),
    requiredPrescription: z.boolean(),
    manufacturer: z.string().min(1, "Manufacturer name is required").nonempty(),
    expiryDate: z.date(),
  }),
});

const updateMedicineValidationSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, "Medicine name is required")
      .max(100, "Name should be less than 100 characters")
      .nonempty()
      .optional(),
    description: z
      .string()
      .min(1, "Description is required")
      .nonempty()
      .optional(),
    price: z
      .number()
      .min(0, "Price must be greater than or equal to 0")
      .optional(),
    stock: z
      .number()
      .min(0, "Stock must be greater than or equal to 0")
      .optional(),
    availability: z
      .boolean()
      .refine((value) => value === true || value === false, {
        message: "InStock must be true or false",
      })
      .optional(),
    requiredPrescription: z.boolean().optional(),
    manufacturer: z
      .string()
      .min(1, "Manufacturer name is required")
      .nonempty()
      .optional(),
    expiryDate: z.date().optional(),
    image: z
      .string()
      .url("Image URL is required and should be a valid URL")
      .nonempty()
      .optional(),
  }),
});

export const MedicineValidation = {
  createMedicineValidationSchema,
  updateMedicineValidationSchema,
};
