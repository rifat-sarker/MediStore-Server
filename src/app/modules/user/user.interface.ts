import { Document } from "mongoose";

// Enum for User Roles
export enum USER_ROLE {
  admin = "admin",
  customer = "customer",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: USER_ROLE;
}
