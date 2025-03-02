import { z } from "zod";

export const createAdminValidationSchema = z.object({
  body: z.object({
    email: z.string({
      invalid_type_error: "Email must be string",
    }),
    password: z
      .string({
        invalid_type_error: "Password must be string",
      })
      .max(20, { message: "Password can not be more than 20 characters" })
      .optional(),
    name: z.string({
      invalid_type_error: "Email must be string",
    }),
    phone: z
      .string({
        invalid_type_error: "Phone No must be string",
      })
      .optional(),
    address: z
      .string({
        invalid_type_error: "Address must be string",
      })
      .optional(),
  }),
});

export const AdminValidations = {
  createAdminValidationSchema,
};
