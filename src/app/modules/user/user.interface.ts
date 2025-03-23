import { Document, Model } from "mongoose";

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

export interface UserModel extends Model<IUser> {
  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string
  ): Promise<boolean>;
  isUserExistsByEmail(id: string): Promise<IUser>;
  checkUserExist(userId: string): Promise<IUser>;
}
