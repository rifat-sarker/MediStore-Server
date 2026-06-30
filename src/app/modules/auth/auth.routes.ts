import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
import { Role } from "@prisma/client";

const router = Router();

// ─── Registration Flow ────────────────────────────────────────────────────────

/** Step 1: Submit registration → OTP emailed */
router.post(
  "/register",
  validateRequest(AuthValidation.registerZodSchema),
  AuthController.register
);

/** Step 2: Verify OTP → account created */
router.post(
  "/verify-otp",
  validateRequest(AuthValidation.verifyOtpZodSchema),
  AuthController.verifyOtp
);

/** Resend OTP (if expired) */
router.post(
  "/resend-otp",
  validateRequest(AuthValidation.resendOtpZodSchema),
  AuthController.resendOtp
);

// ─── Login / Token ────────────────────────────────────────────────────────────

router.post(
  "/login",
  validateRequest(AuthValidation.loginZodSchema),
  AuthController.loginUser
);

router.post("/refresh-token", AuthController.refreshToken);

router.post("/logout", AuthController.logout);

// ─── Password Management ─────────────────────────────────────────────────────

router.post(
  "/forgot-password",
  validateRequest(AuthValidation.forgotPasswordZodSchema),
  AuthController.forgotPassword
);

router.post(
  "/reset-password",
  validateRequest(AuthValidation.resetPasswordZodSchema),
  AuthController.resetPassword
);

router.post(
  "/change-password",
  auth(Role.ADMIN, Role.CUSTOMER, Role.RIDER),
  validateRequest(AuthValidation.changePasswordZodSchema),
  AuthController.changePassword
);

export const AuthRoutes = router;
