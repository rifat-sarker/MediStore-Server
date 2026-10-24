import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { IJwtPayload } from "./auth.interface";

export const createToken = (
  jwtPayload: IJwtPayload,
  secret: Secret,
  expiresIn?: string
) => {
  const expiry = expiresIn || "1d";
  const jwtSecret = secret || "default_jwt_secret_fallback_key";
  return jwt.sign(jwtPayload, jwtSecret, { expiresIn: expiry } as any);
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
