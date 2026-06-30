import httpStatus from "http-status";
import config from "../../config";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";

// POST /auth/register
const register = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.register(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

// POST /auth/verify-otp
const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.verifyOtp(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: result.message,
    data: result.user,
  });
});

// POST /auth/resend-otp
const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.resendOtp(req.body.email);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

// POST /auth/login
const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.loginUser(req.body);
  const { refreshToken, accessToken } = result;

  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 5, // 5 days
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged in successfully!",
    data: { accessToken, refreshToken },
  });
});

// POST /auth/refresh-token
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { authorization } = req.headers;
  const result = await AuthService.refreshToken(authorization as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Token refreshed successfully!",
    data: result,
  });
});

// POST /auth/forgot-password
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.forgotPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

// POST /auth/reset-password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.resetPassword(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

// POST /auth/change-password  (authenticated)
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const result = await AuthService.changePassword(userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

// POST /auth/logout
const logout = catchAsync(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "none",
  });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Logged out successfully!",
    data: null,
  });
});

export const AuthController = {
  register,
  verifyOtp,
  resendOtp,
  loginUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  logout,
};
