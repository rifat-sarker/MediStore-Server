import { z } from "zod";

const createUserValidationSchema = z.object({
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
  }),
});
const updateUserValidationSchema = z.object({
  body: z.object({
    email: z
      .string({
        invalid_type_error: "Email must be string",
      })
      .optional(),
    password: z
      .string({
        invalid_type_error: "Password must be string",
      })
      .max(20, { message: "Password can not be more than 20 characters" })
      .optional(),
  }),
});

export const UserValidation = {
  createUserValidationSchema,
  updateUserValidationSchema,
};
