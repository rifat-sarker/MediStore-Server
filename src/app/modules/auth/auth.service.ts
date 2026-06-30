import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import { IAuth, IJwtPayload } from "./auth.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { createToken, verifyToken } from "./auth.utils";
import config from "../../config";
import { Secret } from "jsonwebtoken";

const loginUser = async (payload: IAuth) => {
  // Use Prisma to find user by email
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "This user is not found");
  }

  // Compare password using bcrypt
  const isPasswordMatched = await bcrypt.compare(payload.password!, user.password);
  
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, "Password does not match");
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

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  let verifiedToken: any = null;
  try {
    verifiedToken = verifyToken(token, config.jwt_refresh_secret as Secret);
  } catch (err) {
    throw new AppError(httpStatus.FORBIDDEN, "Invalid Refresh Token");
  }

  const { userId } = verifiedToken;

  const isUserExist = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const jwtPayload: IJwtPayload = {
    userId: isUserExist.id,
    name: isUserExist.name,
    phone: isUserExist.phone || "",
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const newAccessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as Secret,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
};
