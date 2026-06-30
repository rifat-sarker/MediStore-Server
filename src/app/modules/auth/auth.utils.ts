import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { IJwtPayload } from "./auth.interface";

export const createToken = (
  jwtPayload: IJwtPayload,
  secret: Secret,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn } as any);
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
