import { z } from "zod";

const registerZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }).min(2),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email"),
    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and a number"
      ),
    phone: z.string().optional(),
    address: z.string().optional(),
  }),
});

const verifyOtpZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email"),
    otp: z
      .string({ required_error: "OTP is required" })
      .length(6, "OTP must be 6 digits"),
  }),
});

const resendOtpZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email"),
  }),
});

const loginZodSchema = z.object({
  body: z.object({
    email: z.string({ required_error: "Email is required" }).email(),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: "Refresh Token is required",
    }),
  }),
});

const forgotPasswordZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email"),
  }),
});

const resetPasswordZodSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email"),
    otp: z
      .string({ required_error: "OTP is required" })
      .length(6, "OTP must be 6 digits"),
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and a number"
      ),
  }),
});

const changePasswordZodSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "Old password is required" }),
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain uppercase, lowercase, and a number"
      ),
  }),
});

export const AuthValidation = {
  registerZodSchema,
  verifyOtpZodSchema,
  resendOtpZodSchema,
  loginZodSchema,
  refreshTokenZodSchema,
  forgotPasswordZodSchema,
  resetPasswordZodSchema,
  changePasswordZodSchema,
};
