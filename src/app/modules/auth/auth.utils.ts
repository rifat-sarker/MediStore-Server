import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import { IJwtPayload } from "./auth.interface";
// import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: IJwtPayload,
  secret: Secret,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn: "30d" });
};

export const verifyToken = (token: string, secret: Secret) => {
  return jwt.verify(token, secret) as JwtPayload;
};
