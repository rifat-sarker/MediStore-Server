import mongoose from "mongoose";
import { IAuth, IJwtPayload } from "./auth.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { createToken, verifyToken } from "./auth.utils";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import User from "../user/user.model";

const loginUser = async (payload: IAuth) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const user = await User.findOne({ email: payload.email }).session(session);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "This user is not found");
    }

     if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
       throw new AppError(httpStatus.FORBIDDEN, "Password does not match");
     }


    const jwtPayload: IJwtPayload = {
      userId: user._id as string,
      name: user.name as string,
      email: user.email as string,
      phone: user.phone as string,
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

    await session.commitTransaction();
    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const refreshToken = async (token: string) => {
  let verifiedToken = null;
  try {
    verifiedToken = verifyToken(token, config.jwt_refresh_secret as Secret);
  } catch (err) {
    throw new AppError(httpStatus.FORBIDDEN, "Invalid Refresh Token");
  }

  const { userId } = verifiedToken;

  const isUserExist = await User.findById(userId);
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, "User does not exist");
  }

  const jwtPayload: IJwtPayload = {
    userId: isUserExist._id as string,
    name: isUserExist.name as string,
    phone: isUserExist.phone as string,
    email: isUserExist.email as string,
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
