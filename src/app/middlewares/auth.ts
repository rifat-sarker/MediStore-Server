import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import config from "../config";
import catchAsync from "../utils/catchAsync";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { User } from "../modules/user/user.model";
import { USER_ROLE } from "../modules/user/user.interface";

const auth = (...requiredRoles: USER_ROLE[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // console.log(token);
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    try {
      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as JwtPayload;

      const { role, email } = decoded;

      const user = await User.findOne({ email, role, isActive: true });

      if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "This user is not found!");
      }

      if (requiredRoles && !requiredRoles.includes(role)) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
      }

      req.user = decoded as JwtPayload & { role: string };
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return next(
          new AppError(
            httpStatus.UNAUTHORIZED,
            "Token has expired! Please login again."
          )
        );
      }
      return next(new AppError(httpStatus.UNAUTHORIZED, "Invalid token!"));
    }
  });
};

export default auth;
