import { Document } from "mongoose";

// Enum for User Roles
export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  role: UserRole;
}
