import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import {
  IAuth,
  IChangePassword,
  IForgotPassword,
  IJwtPayload,
  IRegisterPayload,
  IResetPassword,
  IVerifyOtp,
} from "./auth.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { createToken, generateOtp, verifyToken } from "./auth.utils";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import redisClient from "../../utils/redis";
import { sendEmail, generateOtpEmailHtml } from "../../utils/sendEmail";

const OTP_TTL_SECONDS = 300; // 5 minutes

// ─── Register (Step 1): Store pending data + send OTP ───────────────────────
const register = async (payload: IRegisterPayload) => {
  // Check if email already registered in DB
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new AppError(
      httpStatus.CONFLICT,
      "An account with this email already exists"
    );
  }

  // Hash password before storing in Redis
  const hashedPassword = await bcrypt.hash(
    payload.password,
    Number(config.bcrypt_salt_rounds)
  );

  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);

  // Store pending registration data in Redis
  const pendingKey = `pending_reg:${payload.email}`;
  await redisClient.setEx(
    pendingKey,
    OTP_TTL_SECONDS,
    JSON.stringify({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      phone: payload.phone || null,
      address: payload.address || null,
      otp: hashedOtp,
    })
  );

  // Send OTP email
  await sendEmail({
    to: payload.email,
    subject: "Verify your MediStore account",
    html: generateOtpEmailHtml(otp, "account registration"),
  });

  return { message: "OTP sent to your email. Verify within 5 minutes." };
};

// ─── Verify OTP (Step 2): Create user in DB ─────────────────────────────────
const verifyOtp = async (payload: IVerifyOtp) => {
  const pendingKey = `pending_reg:${payload.email}`;
  const pendingData = await redisClient.get(pendingKey);

  if (!pendingData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "OTP expired or not found. Please register again."
    );
  }

  const parsed = JSON.parse(pendingData);
  const isOtpValid = await bcrypt.compare(payload.otp, parsed.otp);
  if (!isOtpValid) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  // Create user in DB
  const user = await prisma.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      password: parsed.password,
      phone: parsed.phone,
      address: parsed.address,
      role: "CUSTOMER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      address: true,
      createdAt: true,
    },
  });

  // Remove pending data from Redis
  await redisClient.del(pendingKey);

  return { message: "Account verified successfully!", user };
};

// ─── Resend OTP ──────────────────────────────────────────────────────────────
const resendOtp = async (email: string) => {
  const pendingKey = `pending_reg:${email}`;
  const pendingData = await redisClient.get(pendingKey);

  if (!pendingData) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No pending registration found for this email. Please register again."
    );
  }

  const parsed = JSON.parse(pendingData);
  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);
  parsed.otp = hashedOtp;

  // Reset TTL with fresh OTP
  await redisClient.setEx(pendingKey, OTP_TTL_SECONDS, JSON.stringify(parsed));

  await sendEmail({
    to: email,
    subject: "Your new MediStore OTP",
    html: generateOtpEmailHtml(otp, "account registration"),
  });

  return { message: "A new OTP has been sent to your email." };
};

// ─── Login ───────────────────────────────────────────────────────────────────
const loginUser = async (payload: IAuth) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "No account found with this email");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password!,
    user.password
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Incorrect password");
  }

  const jwtPayload: IJwtPayload = {
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone || "",
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string
  );

  return { accessToken, refreshToken };
};

// ─── Refresh Token ───────────────────────────────────────────────────────────
const refreshToken = async (token: string) => {
  let verifiedToken: any = null;
  try {
    verifiedToken = verifyToken(token, config.jwt_refresh_secret as Secret);
  } catch {
    throw new AppError(httpStatus.FORBIDDEN, "Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { id: verifiedToken.userId },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const jwtPayload: IJwtPayload = {
    userId: user.id,
    name: user.name,
    phone: user.phone || "",
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as Secret,
    config.jwt_access_expires_in as string
  );

  return { accessToken };
};

// ─── Forgot Password ─────────────────────────────────────────────────────────
const forgotPassword = async (payload: IForgotPassword) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "No account found with this email");
  }

  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);

  const resetKey = `pwd_reset:${payload.email}`;
  await redisClient.setEx(resetKey, OTP_TTL_SECONDS, hashedOtp);

  await sendEmail({
    to: payload.email,
    subject: "MediStore — Password Reset OTP",
    html: generateOtpEmailHtml(otp, "password reset"),
  });

  return { message: "Password reset OTP sent to your email." };
};

// ─── Reset Password ───────────────────────────────────────────────────────────
const resetPassword = async (payload: IResetPassword) => {
  const resetKey = `pwd_reset:${payload.email}`;
  const hashedOtp = await redisClient.get(resetKey);

  if (!hashedOtp) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "OTP expired or not found. Please request a new one."
    );
  }

  const isOtpValid = await bcrypt.compare(payload.otp, hashedOtp);
  if (!isOtpValid) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await prisma.user.update({
    where: { email: payload.email },
    data: { password: hashedPassword },
  });

  await redisClient.del(resetKey);

  return { message: "Password reset successfully." };
};

// ─── Change Password (authenticated) ─────────────────────────────────────────
const changePassword = async (userId: string, payload: IChangePassword) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  const isMatch = await bcrypt.compare(payload.oldPassword, user.password);
  if (!isMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Old password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return { message: "Password changed successfully." };
};

export const AuthService = {
  register,
  verifyOtp,
  resendOtp,
  loginUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
};
