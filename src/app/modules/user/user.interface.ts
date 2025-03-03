import { Document } from "mongoose";

// Enum for User Roles
export enum UserRole {
  admin = "admin",
  customer = "customer",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: UserRole;
}
